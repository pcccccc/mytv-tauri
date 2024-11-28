import {defineStore} from 'pinia';
import Database from '@tauri-apps/plugin-sql';

export const useDbStore = defineStore('db', {
    state: () => ({
        db: null
    }),
    actions: {
        async initDb() {
            if (!this.db) {
                try {
                    this.db = await Database.load('sqlite:media.db');
                    console.log('Database initialized.');
                } catch (error) {
                    console.error('Failed to initialize database:', error);
                }
            } else {
                console.log('Database link.');
            }
        },
    }
});
