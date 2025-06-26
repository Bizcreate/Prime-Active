"use client"

import { createContext, useContext, useReducer, type Dispatch, type ReactNode, useEffect } from "react"

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

export interface Activity {
  id: string
  title: string
  activityType: string
  startedAt: Date
  gearIds?: string[] // IDs of clothing / gear worn
  isTracking: boolean
}

export interface TokenBalances {
  bananaPoints: number
  shakaTokens: number
  iotx: number
}

interface AppState {
  currentActivity: Activity | null
  activitiesHistory: Activity[]
  tokens: TokenBalances
}

type Action =
  | { type: "START_ACTIVITY"; payload: Activity }
  | { type: "STOP_ACTIVITY"; activityId: string }
  | { type: "ADD_TOKENS"; payload: Partial<TokenBalances> }
  | { type: "LOAD_STORED_STATE"; payload: AppState }

/* ------------------------------------------------------------------ */
/*  REDUCER                                                           */
/* ------------------------------------------------------------------ */

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "START_ACTIVITY":
      return {
        ...state,
        currentActivity: action.payload,
      }

    case "STOP_ACTIVITY": {
      if (!state.currentActivity) return state
      const finished = { ...state.currentActivity, isTracking: false }
      return {
        ...state,
        currentActivity: null,
        activitiesHistory: [finished, ...state.activitiesHistory],
      }
    }

    case "ADD_TOKENS":
      return {
        ...state,
        tokens: {
          bananaPoints: state.tokens.bananaPoints + (action.payload.bananaPoints ?? 0),
          shakaTokens: state.tokens.shakaTokens + (action.payload.shakaTokens ?? 0),
          iotx: state.tokens.iotx + (action.payload.iotx ?? 0),
        },
      }

    case "LOAD_STORED_STATE":
      return action.payload

    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "prime-active-app-state"

const loadFromStorage = (): AppState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppState
    // Revive dates
    if (parsed.currentActivity) parsed.currentActivity.startedAt = new Date(parsed.currentActivity.startedAt)
    parsed.activitiesHistory = parsed.activitiesHistory.map((a) => ({
      ...a,
      startedAt: new Date(a.startedAt),
    }))
    return parsed
  } catch {
    return null
  }
}

const saveToStorage = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota / SSR errors */
  }
}

/* ------------------------------------------------------------------ */
/*  CONTEXT + PROVIDER                                                */
/* ------------------------------------------------------------------ */

interface ContextValue extends AppState {
  dispatch: Dispatch<Action>
  startActivity: (activity: Activity) => void
  stopActivity: () => void
  addTokens: (tokens: Partial<TokenBalances>) => void
}

const AppStateContext = createContext<ContextValue | undefined>(undefined)

const defaultState: AppState = {
  currentActivity: null,
  activitiesHistory: [],
  tokens: {
    bananaPoints: 0,
    shakaTokens: 0,
    iotx: 0,
  },
}

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  // Load stored state on first render
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) dispatch({ type: "LOAD_STORED_STATE", payload: stored })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state)
  }, [state])

  /* -------- helper wrappers for consumers ------------------------ */
  const startActivity = (activity: Activity) => dispatch({ type: "START_ACTIVITY", payload: activity })

  const stopActivity = () =>
    dispatch({
      type: "STOP_ACTIVITY",
      activityId: state.currentActivity?.id ?? "",
    })

  const addTokens = (tokens: Partial<TokenBalances>) => dispatch({ type: "ADD_TOKENS", payload: tokens })

  const value: ContextValue = {
    ...state,
    dispatch,
    startActivity,
    stopActivity,
    addTokens,
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  HOOK                                                              */
/* ------------------------------------------------------------------ */

/**
 * Access global application state.
 *
 * Example:
 * const { currentActivity, startActivity } = useAppState()
 */
export const useAppState = (): ContextValue => {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider />")
  return ctx
}

/* ------------------------------------------------------------------ */
