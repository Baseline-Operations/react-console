/**
 * Routes Only Example
 * Demonstrates an application using only routes (no commands)
 */

import React from 'react';
import { render } from '../../src/index';
import { CLIApp, Router, Route, Default } from '../../src/cli';
import { Text, View } from '../../src/index';
import { useRoute, useRouteParams, usePath } from '../../src/cli';

function App() {
  return (
    <CLIApp name="routes-cli" version="1.0.0" description="Routes-only application example">
      <Router description="Application router">
        <Default description="Default interface">
          <HomeComponent />
        </Default>

        <Route path="/" description="Home page">
          <HomeComponent />
        </Route>

        <Route path="/settings" description="Settings page">
          <SettingsComponent />
        </Route>

        <Route path="/profile/:id" description="User profile">
          <ProfileComponent />
        </Route>

        <Route path="/about" description="About page">
          <AboutComponent />
        </Route>
      </Router>
    </CLIApp>
  );
}

function HomeComponent() {
  const path = usePath();

  return (
    <View padding={1}>
      <Text bold color="cyan">
        Routes-Only CLI Application
      </Text>
      <Text>Current path: {path || '/'}</Text>
      <Text>Available routes:</Text>
      <Text> / - Home page</Text>
      <Text> /settings - Settings</Text>
      <Text> /profile/:id - User profile</Text>
      <Text> /about - About</Text>
    </View>
  );
}

function SettingsComponent() {
  const route = useRoute();
  const path = usePath();

  return (
    <View padding={1}>
      <Text bold color="yellow">
        Settings
      </Text>
      <Text>Route: {route || path}</Text>
      <Text>Configure your application settings here.</Text>
    </View>
  );
}

function ProfileComponent() {
  const params = useRouteParams();
  const path = usePath();

  return (
    <View padding={1}>
      <Text bold color="green">
        User Profile
      </Text>
      <Text>Path: {path}</Text>
      <Text>User ID: {params.id || 'not specified'}</Text>
      <Text>Displaying profile for user {params.id}.</Text>
    </View>
  );
}

function AboutComponent() {
  return (
    <View padding={1}>
      <Text bold>About</Text>
      <Text>Routes-Only CLI Application</Text>
      <Text>Version: 1.0.0</Text>
      <Text>This application uses routes instead of commands.</Text>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
