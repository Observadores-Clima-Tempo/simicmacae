import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  temErro: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { temErro: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { temErro: true };
  }

  componentDidCatch(erro: Error, info: ErrorInfo): void {
    console.error("Erro ao renderizar componente:", erro, info);
  }

  render(): ReactNode {
    if (this.state.temErro) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
