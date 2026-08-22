import "./styles.css";

const clock = document.querySelector<HTMLElement>("#clock");

const updateClock = () => {
  if (!clock) return;

  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  clock.textContent = `Reading room open · ${time}`;
};

updateClock();
window.setInterval(updateClock, 30_000);

document.querySelectorAll<HTMLDetailsElement>("details").forEach((detail) => {
  const updateMarker = () => {
    const marker = detail.querySelector<HTMLElement>("summary span");
    if (marker) marker.textContent = detail.open ? "−" : "+";
  };

  updateMarker();
  detail.addEventListener("toggle", updateMarker);
});

const machines = document.querySelectorAll<HTMLElement>(".machine");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  machines.forEach((machine) => observer.observe(machine));
} else {
  machines.forEach((machine) => machine.classList.add("is-visible"));
}
