"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface Activity {
  id: string
  type: string
  status: "setup" | "tracking" | "completed"
  startTime?: Date
  endTime?: Date
  data?: any
}

interface AppState {
  currentActivity: Activity | null
  user: {
    id?: string
    bananaPoints: number
    shakaTokens: number
    iotxTokens: number
  }
  isLoading: boolean
  error: string | null
}

type AppAction =
  | { type: "SET_CURRENT_ACTIVITY"; payload: Activity | null }
  | { type: "UPDATE_USER_TOKENS"; payload: { bananaPoints?: number; shakaTokens?: number; iotxTokens?: number } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_STATE" }

const initialState: AppState = {
  currentActivity: null,
  user: {
    bananaPoints: 0,
    shakaTokens: 0,
    iotxTokens: 0,
  },
  isLoading: false,
  error: null,
}

function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CURRENT_ACTIVITY":
      return {
        ...state,
        currentActivity: action.payload,
      }
    case "UPDATE_USER_TOKENS":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }
    case "RESET_STATE":
      return initialState
    default:
      return state
  }
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialState)

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("primeActiveAppState")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        if (parsedState.currentActivity) {
          dispatch({ type: "SET_CURRENT_ACTIVITY", payload: parsedState.currentActivity })
        }
        if (parsedState.user) {
          dispatch({ type: "UPDATE_USER_TOKENS", payload: parsedState.user })
        }
      }
    } catch (error) {
      console.error("Error loading app state:", error)
    }
  }, [])

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("primeActiveAppState", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving app state:", error)
    }
  }, [state])

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}

export default AppStateContext
