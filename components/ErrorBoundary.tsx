import React, { Component, ReactNode } from "react";

// Define the props for the ErrorBoundary component
interface ErrorBoundaryProps {
  children: ReactNode;
}

// Define the state for the ErrorBoundary component
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
