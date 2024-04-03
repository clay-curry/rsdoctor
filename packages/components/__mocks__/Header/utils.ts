// Alias hooks are defined here to override callbacks / variables comprising the
// application state / logic of production-code. By stripping away state / logic,
// a front-end workshop may assume full control over these values vias passing them
// down as props. For implementation, simply configure the bundler's module resolution
// algorithm to import this file instead of the original utils file.
//
// official documentation for alias is available at
// - https://www.rspack.dev/config/resolve.html
// - https://www.webpack.js.org/configuration/resolve/
//
// motivation for front-end workshops is available at
// - https://bradfrost.com/blog/post/a-frontend-workshop-environment/

// an alias for the language-controlling hook
export function useI18n() {
  return {
    changeLanguage: () => {},
    language: '',
  };
}

// an alias for the theme-controlling hook
export function useTheme() {
  // TODO: discuss/pinpoint ux goals, then expand this logic to include:
  // - role-based color
  // - typography
  // - motion
  // - elevation
  return {
    isLight: true,
  };
}

export const hasBundle = (argv) => true;

export const hasCompile = (argv) => true;
