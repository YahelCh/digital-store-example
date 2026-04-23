
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/MfeApp';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/MfeApp' ? typeof import('REMOTE_ALIAS_IDENTIFIER/MfeApp') :any;