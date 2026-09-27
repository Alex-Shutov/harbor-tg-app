const appSrc = `${window.location.pathname}?app=1`;

export function DemoPhoneShell() {
  return (
    <div className="demo-stage">
      <div className="demo-phone">
        <div className="demo-phone__notch" />
        <iframe
          className="demo-phone__screen"
          title="Harbor demo"
          src={appSrc}
        />
      </div>
      <div className="demo-banner">
        Демонстрационный стенд. Тестовые данные, бизнес-логика упрощена и не
        соответствует продукту заказчика.
      </div>
    </div>
  );
}
