declare module 'firebase/app' {
  export interface FirebaseOptions {
    apiKey?: string
    authDomain?: string
    databaseURL?: string
    projectId?: string
    storageBucket?: string
    messagingSenderId?: string
    appId?: string
    measurementId?: string
  }

  export interface FirebaseApp {
    readonly name: string
    readonly options: FirebaseOptions
    automaticDataCollectionEnabled: boolean
  }

  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp
  export function getApps(): FirebaseApp[]
  export function getApp(name?: string): FirebaseApp
  export function deleteApp(app: FirebaseApp): Promise<void>
}
