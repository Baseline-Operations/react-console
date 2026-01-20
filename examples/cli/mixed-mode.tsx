/**
 * Mixed Mode Example
 * Demonstrates mixing commands and routes in the same application
 */

import { render } from '../../src/index';
import { CLIApp, CommandRouter, Command, Route, Default } from '../../src/cli';
import { Text, View } from '../../src/index';
import { useCommand, useRoute, usePath, useNavigate } from '../../src/cli';

function App() {
  return (
    <CLIApp name="mixed-cli" version="1.0.0" description="Mixed commands and routes example">
      <CommandRouter description="Main application router">
        <Default description="Default interface">
          <HomeComponent />
        </Default>
        
        {/* Command with path - accessible as both command and route */}
        <Command name="build" path="/build" description="Build project">
          <BuildComponent />
        </Command>
        
        {/* Command without path - only accessible as command */}
        <Command name="serve" description="Start server">
          <ServeComponent />
        </Command>
        
        {/* Route - accessible via path */}
        <Route path="/settings" description="Settings page">
          <SettingsComponent />
        </Route>
        
        <Route path="/profile/:id" description="User profile">
          <ProfileComponent />
        </Route>
      </CommandRouter>
    </CLIApp>
  );
}

function HomeComponent() {
  const navigate = useNavigate();
  
  return (
    <View padding={1}>
      <Text bold color="cyan">Mixed Mode CLI Application</Text>
      <Text>This app supports both commands and routes:</Text>
      <Text>Commands:</Text>
      <Text>  build - Build project (also accessible at /build)</Text>
      <Text>  serve - Start server</Text>
      <Text>Routes:</Text>
      <Text>  /settings - Settings page</Text>
      <Text>  /profile/:id - User profile</Text>
    </View>
  );
}

function BuildComponent() {
  const command = useCommand();
  const path = usePath();
  
  return (
    <View padding={1}>
      <Text bold color="yellow">Build Command</Text>
      <Text>Command: {command}</Text>
      <Text>Path: {path}</Text>
      <Text>This command is accessible both as 'build' and '/build'.</Text>
    </View>
  );
}

function ServeComponent() {
  const command = useCommand();
  
  return (
    <View padding={1}>
      <Text bold color="blue">Serve Command</Text>
      <Text>Command: {command}</Text>
      <Text>This command is only accessible as 'serve', not as a route.</Text>
    </View>
  );
}

function SettingsComponent() {
  const route = useRoute();
  const path = usePath();
  
  return (
    <View padding={1}>
      <Text bold color="green">Settings</Text>
      <Text>Route: {route?.location || path}</Text>
      <Text>This is a route-only component.</Text>
    </View>
  );
}

function ProfileComponent() {
  const params = useRouteParams();
  const path = usePath();
  
  return (
    <View padding={1}>
      <Text bold color="magenta">User Profile</Text>
      <Text>Path: {path}</Text>
      <Text>User ID: {params.id || 'not specified'}</Text>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
