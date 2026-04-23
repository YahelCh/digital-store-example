
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/UserStore';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/UserStore' ? typeof import('REMOTE_ALIAS_IDENTIFIER/UserStore') :any;