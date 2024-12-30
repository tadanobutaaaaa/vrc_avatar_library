import React from 'react';
import { ColorModeButton } from "../components/ui/color-mode"

export default function Page({ children }: { children: React.ReactNode }) {
    return (
    <>
        <ColorModeButton />
        {children}
    </>
)
}