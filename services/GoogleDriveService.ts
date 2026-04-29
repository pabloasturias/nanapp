/**
 * nanapp - Google Drive Backup Service
 * Handles OAuth2 authentication and data sync with Google Drive.
 */

const CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com'; // Placeholder
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const BACKUP_FILENAME = 'nanapp_backup.json';

let tokenClient: any;
let gapiInited = false;
let gsisInited = false;

export const GoogleDriveService = {
    init: () => {
        return new Promise<void>((resolve) => {
            const checkReady = () => {
                // @ts-ignore
                if (window.gapi && window.google) {
                    GoogleDriveService.initGapi().then(() => {
                        GoogleDriveService.initGis();
                        resolve();
                    });
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        });
    },

    initGapi: async () => {
        return new Promise<void>((resolve) => {
            // @ts-ignore
            window.gapi.load('client', async () => {
                // @ts-ignore
                await window.gapi.client.init({
                    // No API key needed for drive.file scope usually if using GIS
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                });
                gapiInited = true;
                resolve();
            });
        });
    },

    initGis: () => {
        // @ts-ignore
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined at request time
        });
        gsisInited = true;
    },

    /**
     * Authenticate and get token
     */
    authenticate: async (): Promise<boolean> => {
        return new Promise((resolve) => {
            tokenClient.callback = async (resp: any) => {
                if (resp.error !== undefined) {
                    resolve(false);
                    return;
                }
                localStorage.setItem('nanapp_gdrive_linked', 'true');
                resolve(true);
            };

            if (// @ts-ignore
                window.gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    },

    /**
     * Collect all nanapp data from localStorage
     */
    collectData: () => {
        const data: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('nanapp_') || key.startsWith('baby_'))) {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key) || '{}');
                } catch (e) {
                    data[key] = localStorage.getItem(key);
                }
            }
        }
        return data;
    },

    /**
     * Save backup to Google Drive
     */
    saveBackup: async () => {
        if (!localStorage.getItem('nanapp_gdrive_linked')) return;

        try {
            const data = GoogleDriveService.collectData();
            const content = JSON.stringify(data, null, 2);

            // 1. Check if file exists
            // @ts-ignore
            const response = await window.gapi.client.drive.files.list({
                q: `name = '${BACKUP_FILENAME}' and trashed = false`,
                fields: 'files(id, name)',
            });

            const files = response.result.files;
            const fileId = files && files.length > 0 ? files[0].id : null;

            if (fileId) {
                // Update existing
                await GoogleDriveService.updateFile(fileId, content);
            } else {
                // Create new
                await GoogleDriveService.createFile(content);
            }
            
            localStorage.setItem('nanapp_last_backup', Date.now().toString());
            console.log('Backup saved to Google Drive');
        } catch (err) {
            console.error('Error saving to Drive', err);
        }
    },

    createFile: async (content: string) => {
        const metadata = {
            name: BACKUP_FILENAME,
            mimeType: 'application/json',
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([content], { type: 'application/json' }));

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 
                // @ts-ignore
                Authorization: 'Bearer ' + window.gapi.client.getToken().access_token 
            }),
            body: form,
        });
    },

    updateFile: async (fileId: string, content: string) => {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
            method: 'PATCH',
            headers: new Headers({ 
                // @ts-ignore
                Authorization: 'Bearer ' + window.gapi.client.getToken().access_token 
            }),
            body: content,
        });
    },

    /**
     * Restore from Google Drive
     */
    restoreBackup: async () => {
        try {
            // @ts-ignore
            const response = await window.gapi.client.drive.files.list({
                q: `name = '${BACKUP_FILENAME}' and trashed = false`,
                fields: 'files(id, name)',
            });

            const files = response.result.files;
            if (!files || files.length === 0) return false;

            const fileId = files[0].id;
            const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: new Headers({ 
                    // @ts-ignore
                    Authorization: 'Bearer ' + window.gapi.client.getToken().access_token 
                }),
            });

            const data = await res.json();
            
            // Apply data to localStorage
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            });

            return true;
        } catch (err) {
            console.error('Error restoring from Drive', err);
            return false;
        }
    }
};
