declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg?react' {

  interface SVGRProps {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps>;
  export default ReactComponent;
}

declare global {
  interface Window {
    env?: {
      BACKEND_URL?: string;
      HCAPTCHA_SITEKEY?: string;
    };
  }
}
