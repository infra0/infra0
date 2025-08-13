export interface BaseCommandOptions {
    info: string;
}

export interface Infra0ProjectConfig {
    metadataDirectoryName: string;
    overrideFileName: string;
    projectJSONFileName: string;
}

export interface Infra0ProjectToken {
    token: string;
    expiresAt: string;
}

export interface Infra0ProjectTokensData {
    access: Infra0ProjectToken
    refresh: Infra0ProjectToken
}


export interface Infra0ProjectJSON {
    path: string;
    visualizerData: {
        tokens: Infra0ProjectTokensData;
    };
}