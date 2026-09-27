import React from 'react';
import { Title, Accordion } from '@shared/ui';
import './bonuses-faq-widget.scss';

const FAQ_ACCOUNT = 'harbor_help'

const onOpenChat = () => {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    try {
      // Открыть чат с пользователем
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${FAQ_ACCOUNT}`);
      return;
    } catch (error) {
      console.warn('Failed to open Telegram link, falling back to window.open:', error);
    }
  }
  // Фолбек: открываем в новой вкладке
  window.open(`https://t.me/${FAQ_ACCOUNT}`, '_blank', 'noopener,noreferrer');
};

const FAQ_ITEMS = [
  {
    title: 'Как потратить бонусы?',
    content:
      'Бонусы можно потратить на покупку промокодов и участие в розыгрышах',
  },
  {
    title: 'Как получить бонусы?',
    content:
      'Бонусы можно получить за выполнение заданий, участие в реферальной программе и другие активности',
  },
  {
    title: 'Как долго проверяются задания?',
    content:
      'Задания обычно проверяются в течение 3 часов. В периоды высокой загрузки это время может увеличиться до 12 часов.\n' +
      'Если у вас возникнут вопросы, не стесняйтесь, пишите нам! Мы всегда на связи. 😊',
  },
  {
    title: 'Напишите нам',
    content: (
      <span>
        Если у вас есть вопросы, вы можете написать нам по указанным контактам:{' '}
        <a
          href={`https://t.me/${FAQ_ACCOUNT}`}
          rel="noreferrer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChat();
          }}
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
        >
          {`@${FAQ_ACCOUNT}`}
        </a>
      </span>
    ),
  },
];


export const BonusesFAQWidget: React.FC = () => {
  return (
    <div className="bonuses-faq-widget">
      <Title>FAQ</Title>
      <Accordion items={FAQ_ITEMS} />
    </div>
  );
};

