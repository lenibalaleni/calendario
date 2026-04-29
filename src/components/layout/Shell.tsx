import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { PageHeader } from "./PageHeader";

export function Shell() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-20 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}