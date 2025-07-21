"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface Player {
  id: string;
  name: string;
  totalScore: number;
}

export interface Hole {
  hole: number;
  scores: Player[];
  id: string;
  isActive: boolean;
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  location: {
    latitude: number;
    longitude: number;
  } | null;
  holes: number | string;
  holeList: Hole[];
  currentHole: string;
  startTime: number;
  endTime: number | null;
}

export interface GameState {
  currentGame: Game | null;
  history: Game[] | [];
}

interface MetaData {
  permissions: {
    geolocation: PermissionState;
  };
} 

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  isLoading: boolean;
  metaData: MetaData | null;
  setMetaData: React.Dispatch<React.SetStateAction<MetaData | null>>
}

const GameStateContext = createContext<GameStateContextType | null>(null);

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({ currentGame: null, history: [] });
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the game state data from local storage on first load along with some "meta data"
  useEffect(() => {
    const savedState = localStorage.getItem("gameState");

    if (savedState) {
      const parsedState = JSON.parse(savedState) as GameState;

      if ("currentGame" in parsedState && "history" in parsedState) {
        setGameState(parsedState);
      }

      if ("permissions" in navigator && "geolocation" in navigator) {
        async function queryGeolocationPermission() {
          try {
            const result = await navigator.permissions.query({ name: "geolocation" });

            return setMetaData({ permissions: { geolocation: result.state } });
          } catch (err) {
            console.error("Error reading permissions and geolocation: ", err);
          }
        }

        queryGeolocationPermission();
      }
    }

    setIsLoading(false);
  }, []);

  // Update the local storage when gameState object changes to keep it in sync
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState, isLoading]);

  const value = useMemo(() => ({ gameState, setGameState, isLoading, metaData, setMetaData }), [gameState, isLoading, metaData]);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

// Use the context as hook
export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }

  return context;
};