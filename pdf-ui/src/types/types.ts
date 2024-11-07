export type ComponentType = 'text' | 'rectangle' | 'circle' | 'line' | 'image';

export interface BasePDFComponent {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    style?: React.CSSProperties;
}

export interface TextArea extends BasePDFComponent {
    type: 'text';
    content: string;
    width: number;
    height: number;
}

export interface Shape extends BasePDFComponent {
    type: 'rectangle' | 'circle' | 'line';
    width: number;
    height: number;
    strokeColor: string;
    strokeWidth: number;
    fillColor: string;
    radius?: number;
}

export interface Image extends BasePDFComponent {
    type: 'image';
    width: number;
    height: number;
    src: string;
    alt?: string;
}

export type PDFComponent = TextArea | Shape | Image;