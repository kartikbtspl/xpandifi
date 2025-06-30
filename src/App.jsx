import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout"

const App = () => {
  return (
    <div>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </div>
  )
}
export default App;