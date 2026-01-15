import React, { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';

interface UpdateInfo {
    version: string;
    releaseNotes?: string | Array<{ note: string }>;
}

export const UpdateNotification: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [status, setStatus] = useState<'available' | 'downloading' | 'ready'>('available');
    const [progress, setProgress] = useState<number>(0);
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        // Detect platform roughly (or expose via API, but generic works)
        // Since we know logic in main:
        // Mac: update-available -> prompt to open link.
        // Win: update-available -> downloading -> update-downloaded -> prompt to install.
        
        // We can just rely on event flow.

        const handleUpdateAvailable = (info: any) => {
            console.log('Update available:', info);
            setUpdateInfo(info);
            setIsOpen(true);
            setStatus('available');
            
            // Hacky check for Mac: If we are on Mac, main process sends 'update-available' but won't send 'update-downloaded'.
            // We can check navigator.platform
            if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
                setIsMac(true);
            }
        };

        const handleUpdateProgress = (progressObj: any) => {
            setStatus('downloading');
            setProgress(progressObj.percent);
        };

        const handleUpdateDownloaded = (info: any) => {
            console.log('Update downloaded:', info);
            setUpdateInfo(info);
            setStatus('ready');
            setIsOpen(true); // Ensure it's open
            setIsMac(false); // Definitely not manual flow if downloaded
        };

        const handleUpdateError = (err: string) => {
            console.error('Update error:', err);
            // Optional: show error state
        };

        window.api.updater.onUpdateAvailable(handleUpdateAvailable);
        window.api.updater.onUpdateProgress(handleUpdateProgress);
        window.api.updater.onUpdateDownloaded(handleUpdateDownloaded);
        window.api.updater.onUpdateError(handleUpdateError);

        return () => {
            window.api.updater.removeListeners();
        };
    }, []);

    const handleAction = () => {
        if (isMac) {
            window.api.updater.openDownloadPage();
            setIsOpen(false);
        } else if (status === 'ready') {
            window.api.updater.installUpdate();
        } else {
            // Downloading... hide dialog?
            setIsOpen(false);
        }
    };

    if (!isOpen || !updateInfo) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {status === 'ready' ? 'Update Ready' : 'Update Available'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        A new version ({updateInfo.version}) is available.
                        {status === 'downloading' && (
                            <div className="mt-2">
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Downloading... {Math.round(progress)}%</p>
                            </div>
                        )}
                        {status === 'available' && isMac && (
                            <p className="mt-2">
                                Due to security settings, please download and install the update manually.
                            </p>
                        )}
                        {status === 'available' && !isMac && (
                            <p className="mt-2">
                                The update will download in the background.
                            </p>
                        )}
                         {status === 'ready' && (
                            <p className="mt-2">
                                Restart the application to apply the update.
                            </p>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        {status === 'ready' ? 'Later' : 'Close'}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleAction}>
                        {isMac ? 'Download Page' : (status === 'ready' ? 'Restart & Install' : 'OK')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
