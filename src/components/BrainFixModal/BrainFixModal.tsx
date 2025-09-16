import React, { useState, useEffect, useRef } from 'react';
import styles from './BrainFixModal.module.scss';

interface BrainFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeoutTriggeredAt?: string; // ISO string of when timeout was triggered
  timeoutAttemptHistory?: number; // Number of timeout attempts
}

// Original facts about Rostam and Rakhsh
const factsRostam = [
  "هفت خان رستم یکی از معروف‌ترین داستان‌های شاهنامه فردوسی است که در آن رستم برای نجات کیکاووس باید از هفت خان خطرناک عبور کند.",
  "رخش اسب معروف رستم بود که در تمام جنگ‌ها و ماجراهایش همراه او بود و به او در نبردها کمک می‌کرد.",
  "در خان اول، رستم با شیر جنگید و آن را شکست داد. این خان نماد غلبه بر ترس و شجاعت است.",
  "خان دوم مربوط به جنگ با اژدها بود که رستم با هوش و مهارت خود آن را شکست داد.",
  "رخش نه تنها اسب رستم بود، بلکه دوست و همراه وفادارش محسوب می‌شد و در لحظات سخت کنارش بود.",
  "در خان سوم، رستم با جادوگر جنگید و با استفاده از خرد خود بر او پیروز شد.",
  "هفت خان رستم نماد هفت مرحله رشد و تکامل روحی و جسمی انسان است.",
  "رخش در زبان فارسی به معنای 'درخشنده' و 'نورانی' است که نشان‌دهنده پاکی و نورانیت است.",
  "در خان چهارم، رستم با دیو جنگید و با شجاعت و مهارت خود آن را شکست داد.",
  "فردوسی در شاهنامه، رخش را به عنوان اسبی توصیف کرده که سرعت و قدرت فوق‌العاده‌ای داشت.",
  "خان پنجم مربوط به جنگ با اژدهای آتشین بود که رستم با صبر و حوصله آن را شکست داد.",
  "رخش در تمام ماجراهای رستم حضور داشت و هرگز او را تنها نگذاشت.",
  "در خان ششم، رستم با جادوگر بزرگ جنگید و با استفاده از خرد و شجاعت خود بر او پیروز شد.",
  "هفت خان رستم یکی از مهم‌ترین بخش‌های ادبیات فارسی است که درس‌های اخلاقی زیادی دارد.",
  "رخش نماد وفاداری، دوستی و همراهی در ادبیات فارسی است.",
  "در خان هفتم و آخر، رستم با بزرگ‌ترین دشمن خود جنگید و با شجاعت و مهارت خود پیروز شد.",
  "فردوسی در شاهنامه تأکید کرده که رخش نه تنها اسب رستم بود، بلکه دوست و همراه او محسوب می‌شد.",
  "هفت خان رستم نشان‌دهنده این است که برای رسیدن به هدف، باید از موانع و مشکلات عبور کرد.",
  "رخش در تمام جنگ‌ها و ماجراهای رستم حضور داشت و به او در نبردها کمک می‌کرد.",
  "فردوسی در شاهنامه، رخش را به عنوان اسبی توصیف کرده که سرعت و قدرت فوق‌العاده‌ای داشت."
];

// Alternative facts about Persian mythology and heroes
const factsMythology = [
  "کاوه آهنگر با درفش کاویانی خود علیه ضحاک قیام کرد و مردم را به آزادی دعوت کرد.",
  "سیمرغ پرنده افسانه‌ای ایرانی است که در شاهنامه به عنوان پرنده‌ای خردمند و قدرتمند توصیف شده.",
  "زال پدر رستم بود که توسط سیمرغ بزرگ شد و بعدها پدر رستم شد.",
  "کیکاووس پادشاه ایران بود که توسط دیوها اسیر شد و رستم برای نجاتش به هفت خان رفت.",
  "سهراب پسر رستم بود که در جنگ با پدرش کشته شد و این یکی از غمگین‌ترین داستان‌های شاهنامه است.",
  "تهمینه همسر رستم و مادر سهراب بود که در توران زندگی می‌کرد.",
  "افراسیاب پادشاه توران و دشمن اصلی ایران بود که در جنگ‌های متعدد با ایرانیان جنگید.",
  "گودرز یکی از پهلوانان بزرگ ایرانی بود که در جنگ‌های متعدد شرکت داشت.",
  "بیژن پسر گودرز بود که در جنگ با افراسیاب کشته شد.",
  "گیو پدر بیژن و یکی از پهلوانان بزرگ ایرانی بود.",
  "طوس یکی از پهلوانان ایرانی بود که در جنگ‌های متعدد شرکت داشت.",
  "فرامرز پسر رستم بود که بعد از مرگ پدرش به انتقام او برخاست.",
  "اسفندیار پسر گشتاسب بود که در جنگ با رستم کشته شد.",
  "گشتاسب پادشاه ایران بود که در زمان رستم حکومت می‌کرد.",
  "زریر برادر گشتاسب بود که در جنگ با افراسیاب کشته شد.",
  "هوم خدای گیاه مقدس ایرانیان بود که در مراسم مذهبی استفاده می‌شد.",
  "آناهیتا الهه آب و باروری در آیین زرتشتی بود.",
  "مهر خدای عهد و پیمان در آیین زرتشتی بود.",
  "اهورامزدا خدای بزرگ زرتشتیان بود که خالق همه چیز محسوب می‌شد.",
  "اهریمن نیروی شر در آیین زرتشتی بود که با اهورامزدا در جنگ بود."
];

// Alternative facts about Persian culture and history
const factsCulture = [
  "نوروز مهم‌ترین جشن ایرانیان است که در اول بهار برگزار می‌شود و نماد تجدید حیات است.",
  "سفره هفت‌سین یکی از سنت‌های نوروزی است که هفت چیز که با 'س' شروع می‌شود روی آن قرار می‌گیرد.",
  "چهارشنبه‌سوری آخرین چهارشنبه سال است که مردم آتش روشن می‌کنند و از روی آن می‌پرند.",
  "عید فطر جشن پایان ماه رمضان است که مسلمانان آن را جشن می‌گیرند.",
  "عید قربان جشن قربانی کردن است که در آن گوسفند قربانی می‌شود.",
  "شب یلدا طولانی‌ترین شب سال است که خانواده‌ها دور هم جمع می‌شوند.",
  "ماه محرم ماه عزاداری شیعیان است که در آن مراسم عاشورا برگزار می‌شود.",
  "تاسوعا و عاشورا روزهای مهم عزاداری شیعیان هستند.",
  "ماه رمضان ماه روزه‌گیری مسلمانان است که در آن از طلوع تا غروب خورشید روزه می‌گیرند.",
  "حج یکی از ارکان اسلام است که مسلمانان باید حداقل یک بار در عمر خود انجام دهند.",
  "زکات یکی از ارکان اسلام است که مسلمانان باید بخشی از اموال خود را به فقرا بدهند.",
  "نماز یکی از ارکان اسلام است که مسلمانان باید پنج بار در روز انجام دهند.",
  "شهادتین دو جمله‌ای است که مسلمان شدن با گفتن آن آغاز می‌شود.",
  "قرآن کتاب مقدس مسلمانان است که کلام خدا محسوب می‌شود.",
  "حدیث سخنان پیامبر اسلام است که توسط صحابه نقل شده است.",
  "سنت روش و رفتار پیامبر اسلام است که مسلمانان باید از آن پیروی کنند.",
  "فقه علم استنباط احکام شرعی از منابع اسلامی است.",
  "تفسیر علم تفسیر قرآن است که معانی آیات را توضیح می‌دهد.",
  "تاریخ اسلام تاریخ زندگی پیامبر و خلفای راشدین است.",
  "سیره پیامبر روش زندگی و رفتار پیامبر اسلام است."
];

// Alternative facts about Persian literature and poetry
const factsLiterature = [
  "فردوسی شاعر بزرگ ایرانی است که شاهنامه را در مدت ۳۰ سال سرود.",
  "شاهنامه فردوسی شامل ۶۰ هزار بیت شعر است و یکی از بزرگ‌ترین آثار ادبی جهان محسوب می‌شود.",
  "حافظ شاعر بزرگ ایرانی است که دیوانش یکی از محبوب‌ترین کتاب‌های شعر فارسی است.",
  "سعدی شاعر و نویسنده بزرگ ایرانی است که گلستان و بوستان را نوشته است.",
  "مولوی شاعر و عارف بزرگ ایرانی است که مثنوی معنوی را سرود.",
  "عطار شاعر و عارف بزرگ ایرانی است که منطق‌الطیر را نوشته است.",
  "نظامی شاعر بزرگ ایرانی است که خمسه را سرود.",
  "خاقانی شاعر بزرگ ایرانی است که قصاید زیبایی سروده است.",
  "انوری شاعر بزرگ ایرانی است که قصاید و غزلیات زیبایی دارد.",
  "رودکی پدر شعر فارسی است که اولین شاعر بزرگ فارسی‌زبان محسوب می‌شود.",
  "فارابی فیلسوف بزرگ ایرانی است که در فلسفه و منطق تأثیر زیادی داشته است.",
  "ابن سینا پزشک و فیلسوف بزرگ ایرانی است که قانون در طب را نوشته است.",
  "خوارزمی ریاضیدان بزرگ ایرانی است که جبر را اختراع کرده است.",
  "رازی شیمی‌دان و پزشک بزرگ ایرانی است که در علم شیمی تأثیر زیادی داشته است.",
  "بیرونی دانشمند بزرگ ایرانی است که در نجوم و جغرافیا تأثیر زیادی داشته است.",
  "خیام شاعر و ریاضیدان بزرگ ایرانی است که رباعیات زیبایی سروده است.",
  "ناصرخسرو شاعر و فیلسوف بزرگ ایرانی است که سفرنامه‌ای زیبا نوشته است.",
  "عمر خیام علاوه بر شعر، در ریاضیات و نجوم نیز تأثیر زیادی داشته است.",
  "ابوریحان بیرونی در کتاب آثار الباقیه درباره تاریخ و فرهنگ ملل مختلف نوشته است.",
  "ابوعلی سینا در کتاب شفا درباره فلسفه و منطق مطالب مهمی نوشته است."
];

export const BrainFixModal: React.FC<BrainFixModalProps> = ({ isOpen, onClose, timeoutTriggeredAt, timeoutAttemptHistory = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Select facts based on timeoutAttemptHistory % 4
  const getFacts = () => {
    const factSetIndex = timeoutAttemptHistory % 4;
    switch (factSetIndex) {
      case 0:
        return factsRostam;
      case 1:
        return factsMythology;
      case 2:
        return factsCulture;
      case 3:
        return factsLiterature;
      default:
        return factsRostam;
    }
  };

  const facts = getFacts();

  useEffect(() => {
    if (!isOpen) return;

    // Play background music when modal opens
    const playBackgroundMusic = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://load.filespacer.ir/music/B/Bikalam.Aroom/Loreena.McKennitt.Tango.To.Evora.%5Bsongha.ir%5D.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // Set volume to 30%
      }
      
      if (audioEnabled) {
        audioRef.current.play().catch((error) => {
          console.log('Audio playback failed:', error);
        });
      }
    };

    // Calculate remaining time based on when timeout was triggered
    const calculateRemainingTime = () => {
      if (timeoutTriggeredAt) {
        const triggeredTime = new Date(timeoutTriggeredAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - triggeredTime) / 1000);
        const remaining = Math.max(0, 120 - elapsedSeconds);
        return remaining;
      }
      return 120; // Default 2 minutes if no timeout time provided
    };

    const initialTimeLeft = calculateRemainingTime();
    setTimeLeft(initialTimeLeft);
    setCurrentFactIndex(0);

    // Play background music
    playBackgroundMusic();

    // If time is already up, close immediately
    if (initialTimeLeft <= 0) {
      onClose();
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Change fact every 6 seconds
    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
      // Stop audio when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isOpen, onClose, timeoutTriggeredAt, audioEnabled]);

  // Function to enable audio playback
  const enableAudio = () => {
    setAudioEnabled(true);
    if (audioRef.current && isOpen) {
      audioRef.current.play().catch((error) => {
        console.log('Audio playback failed:', error);
      });
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((120 - timeLeft) / 120) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>مغزمو سوزوندی حالا باید ۲ دقیقه وایسی تا مغزمو درست کنم</h2>
          {!audioEnabled && (
            <button 
              className={styles.playButton}
              onClick={enableAudio}
            >
              🎵 پخش موسیقی
            </button>
          )}
        </div>
        
        <div className={styles.content}>
          <div className={styles.timerSection}>
            <div className={styles.timer}>
              <div className={styles.timeDisplay}>
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.factsSection}>
            <h3 className={styles.factsTitle}>آیا می‌دانستید؟</h3>
            <div className={styles.factContainer}>
              <p className={styles.factText}>{facts[currentFactIndex]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
