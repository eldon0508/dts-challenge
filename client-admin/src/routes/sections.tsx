import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

import { varAlpha } from "src/theme/styles";
import { AuthLayout } from "src/layouts/auth";
import { DashboardLayout } from "src/layouts/dashboard";

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import("src/pages/home"));

export const TaskPage = lazy(() => import("src/pages/task/tasks"));
export const TaskCreatePage = lazy(() => import("src/pages/task/taskCreate"));
export const TaskEditPage = lazy(() => import("src/pages/task/taskEdit"));

export const SignInPage = lazy(() => import("src/pages/sign-in"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: "text.primary" },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: "/dashboard", element: <HomePage /> },

        { path: "tasks", element: <TaskPage /> },
        { path: "tasks/create", element: <TaskCreatePage /> },
        { path: "tasks/:id/edit", element: <TaskEditPage /> },
      ],
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
