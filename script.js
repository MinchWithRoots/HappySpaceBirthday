gsap.registerPlugin(ScrollTrigger);

// 1. Плавный скролл
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. Таймлайн анимации
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-stage",
    start: "top top",
    end: "+=200%", // Длина скролла
    scrub: 1,
    pin: ".stage-inner",
  },
});

const mm = gsap.matchMedia();

// Десктоп: Текст наезжает -> Картинка слева, Текст справа
mm.add("(min-width: 768px)", () => {
  tl
    // 1. Появление текста поверх картинки
    .to(".text-group", { opacity: 1, y: 0, duration: 0.25 })

    // 2. Разъезд в стороны
    // Картинка немного уменьшается, но остается КРУПНОЙ (scale 0.85)
    .to(".galaxy-img", { scale: 0.85, x: "-22vw", duration: 0.6 }, "split")
    .to(".text-group", { x: "22vw", duration: 0.6 }, "split")

    // 3. Появление блока с описанием
    .to(".description", { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
});

// Мобильные: Вертикальный стек
mm.add("(max-width: 767px)", () => {
  tl.to(".text-group", { opacity: 1, y: 0, duration: 0.25 })
    .to(".galaxy-img", { scale: 0.9, y: "-12vh", duration: 0.6 }, "split")
    .to(".text-group", { y: "12vh", duration: 0.6 }, "split")
    .to(".description", { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
});

// Кнопка
document.getElementById("share-btn")?.addEventListener("click", function () {
  navigator.clipboard.writeText("🌌 Галактика 7 мая: NGC 3982!");
  const btn = this;
  btn.innerText = "✓ Скопировано";
  setTimeout(() => (btn.innerText = "Поделиться 📤"), 2000);
});
