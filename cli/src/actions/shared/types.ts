export interface Infra0ProjectConfig {
    metadataDirectoryName: string;
    overrideFileName: string;
    projectJSONFileName: string;
}


export interface Infra0ProjectJSON {
    path: string;
    visualizerData: {
        userId: string;
        tokens: {
            access: {
                token: string;
                expiresAt: string;
            }
            refresh: {
                token: string;
                expiresAt: string;
            }
        }
    };
}