import { fetchDashboardData } from "./actions"; // Import the server action
import DashboardUI from "../components/DashboardUI"; // Import the component

export const dynamic = "force-dynamic"; // Ensure it's not cached

export default async function Page() {
  // 1. Fetch data on the server
  const initialData = await fetchDashboardData();

  // 2. Pass it as a SINGLE prop named 'initialData'
  return (
    <DashboardUI 
      initialData={initialData} 
    />
  );
}