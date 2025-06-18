
import { ReactNode } from 'react';

export interface NavigationLink {
  readonly path: string;
  readonly label: string;
  readonly translationKey: string;
}

export interface HeaderVisibilityState {
  isOnLoginPage: boolean;
  isTransitioning: boolean;
}

export interface ConditionalVisibilityProps {
  children: ReactNode;
  condition: boolean;
  className?: string;
}

export interface HeaderSectionProps {
  visibilityState: HeaderVisibilityState;
}

export interface HeaderLogicReturn {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  scrolled: boolean;
  isActive: (path: string) => boolean;
  navLinks: readonly NavigationLink[];
  handleNavLinkClick: (e: React.MouseEvent, isActivePath: boolean) => void;
  handleLoginClick: (e: React.MouseEvent) => void;
  isOnLoginPage: boolean;
  isTransitioning: boolean;
}
