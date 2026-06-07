const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];

const resolvePackage = (name) =>
  path.dirname(require.resolve(`${name}/package.json`, { paths: [projectRoot, workspaceRoot] }));

const workspacePackage = (folder) => path.resolve(workspaceRoot, 'packages', folder);

config.resolver.extraNodeModules = {
  react: resolvePackage('react'),
  'react-dom': resolvePackage('react-dom'),
  'react-native': resolvePackage('react-native'),
  'react-native-web': resolvePackage('react-native-web'),
  '@babel/runtime': resolvePackage('@babel/runtime'),
  '@tanstack/react-query': resolvePackage('@tanstack/react-query'),
  axios: resolvePackage('axios'),
  jotai: resolvePackage('jotai'),
  '@travel-gacha/ui': workspacePackage('ui'),
  '@travel-gacha/store': workspacePackage('store'),
  '@travel-gacha/api': workspacePackage('api'),
  '@travel-gacha/utils': workspacePackage('utils'),
  '@travel-gacha/types': workspacePackage('types')
};

const reactModules = new Set(['react', 'react-native', 'react-dom', 'react-native-web']);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (reactModules.has(moduleName)) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [projectRoot, workspaceRoot] })
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
