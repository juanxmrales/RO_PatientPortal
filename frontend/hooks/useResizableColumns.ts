import { useState, useCallback } from "react";

export default function useResizableColumns() {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [isResizing, setIsResizing] = useState(false);
    const [resizingColumn, setResizingColumn] = useState<string | null>(null);

    const handleMouseDown = useCallback(
        (column: string, e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);
            setResizingColumn(column);
            const startX = e.clientX;
            const startWidth = columnWidths[column] ?? 120;

            const handleMouseMove = (e: MouseEvent) => {
                const diff = e.clientX - startX;
                const newWidth = Math.max(80, startWidth + diff);
                setColumnWidths((prev) => ({ ...prev, [column]: newWidth }));
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                setResizingColumn(null);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            };

            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [columnWidths]
    );

    return { columnWidths, handleMouseDown };
}
