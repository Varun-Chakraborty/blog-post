import { useState } from "react";
import { LeftPanel } from "./left";
import { RightPanel } from "./right";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <LeftPanel isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />
      <RightPanel isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />
    </>
  );
}
