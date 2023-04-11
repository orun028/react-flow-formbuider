import { memo } from "react";

interface PropsContextMenu {
    isOpen: boolean
    position: { x: number; y: number };
    actions: { label: string, effect: () => void }[]
    onmouseleave: React.MouseEventHandler<HTMLDivElement> | undefined
}

export const ContextMenu = memo(
    ({ isOpen, position, actions, onmouseleave }: PropsContextMenu) =>
        isOpen ? (<div
            className="flow-context-menu"
            style={{
                left: position.x,
                top: position.y
            }}
            onMouseLeave={onmouseleave}>
            {actions.map(action => (
                <div className="flow-context-item" key={action.label} onClick={action.effect}>
                    {action.label}
                </div>)
            )}
        </div>) : null
)