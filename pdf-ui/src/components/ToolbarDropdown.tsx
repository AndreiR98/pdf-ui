import React from 'react';
import { Settings, Download, Printer, Layout, Grid, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarDropdownProps {
    onExport?: (format: string) => void;
    onPageSetup?: () => void;
    onPrint?: () => void;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
                                                                    onExport = () => {},
                                                                    onPageSetup = () => {},
                                                                    onPrint = () => {},
                                                                }) => {
    const pageSizes = [
        { name: 'A4', width: '210mm', height: '297mm' },
        { name: 'Letter', width: '215.9mm', height: '279.4mm' },
        { name: 'Legal', width: '215.9mm', height: '355.6mm' },
    ];

    const gridSizes = [
        { name: 'None', size: 0 },
        { name: 'Small (5px)', size: 5 },
        { name: 'Medium (10px)', size: 10 },
        { name: 'Large (20px)', size: 20 },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Options</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                {/* Export Options */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        <span>Export As</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => onExport('pdf')}>
                            PDF Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport('image')}>
                            Image (PNG)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport('svg')}>
                            SVG Vector
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Page Setup */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                        <Layout className="w-4 h-4 mr-2" />
                        <span>Page Size</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {pageSizes.map((size) => (
                            <DropdownMenuItem key={size.name}>
                                {size.name} ({size.width} × {size.height})
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Grid Settings */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                        <Grid className="w-4 h-4 mr-2" />
                        <span>Grid Size</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {gridSizes.map((grid) => (
                            <DropdownMenuItem key={grid.name}>
                                {grid.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Theme Settings */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Light</DropdownMenuItem>
                        <DropdownMenuItem>Dark</DropdownMenuItem>
                        <DropdownMenuItem>System</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Print Option */}
                <DropdownMenuItem onClick={onPrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    <span>Print</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};