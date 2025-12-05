export interface IAPIRule {
    [key: string]: string[];
}

export interface IAutoLoginConfig {
    enabled: boolean;
    endpoint: string;
    method: string;
    credentials_fields: {
        email: string;
        password: string;
    };
    token_response_path: string;
    token_type: string;
}

export interface IConfig {
    title: string;
    default_headers: Record<string, string>;
    auto_login?: IAutoLoginConfig;
}

export interface IAPIInfo {
    uri: string;
    middlewares: string[];
    controller: string;
    controller_full_path: string;
    method: string;
    http_method: string;
    rules: IAPIRule;
    path_parameters: IAPIRule;
    doc_block: string;
    group: string;
    group_index: number;
    responses: string[];
    requires_auth?: boolean;
}

export interface IAuthState {
    isAuthenticated: boolean;
    token: string | null;
    tokenType: string;
    adminEmail: string;
    adminPassword: string;
}

export interface LRDResponse {
    data: unknown,
    _lrd: {
        queries: [],
        logs: {
            level: string,
            message: string,
            context: [],
        }[],
        models: [],
        modelsTimeline: [],
        memory: string,
    }
}
