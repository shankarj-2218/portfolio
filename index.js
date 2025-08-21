      // ------------------------------
      // Minimal JS: theme + scroll state
      // ------------------------------
      (function () {
        const root = document.documentElement;
        const key = "theme";
        const btn = document.getElementById("themeBtn");
        const saved = localStorage.getItem(key);
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const initial = saved || (prefersDark ? "dark" : "light");
        if (initial === "dark") {
          root.setAttribute("data-theme", "dark");
        }

        function toggle() {
          const current =
            root.getAttribute("data-theme") === "dark" ? "light" : "dark";
          if (current === "dark") root.setAttribute("data-theme", "dark");
          else root.removeAttribute("data-theme");
          localStorage.setItem(key, current);
          btn.setAttribute("aria-label", "Theme: " + current);
        }
        btn?.addEventListener("click", toggle);

        // Active link on scroll
        const links = Array.from(
          document.querySelectorAll('.links a[href^="#"]')
        );
        const sections = links
          .map((a) => document.querySelector(a.getAttribute("href")))
          .filter(Boolean);
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              const i = sections.indexOf(e.target);
              if (i > -1) {
                const a = links[i];
                if (e.isIntersecting) {
                  a.classList.add("active");
                } else {
                  a.classList.remove("active");
                }
              }
            });
          },
          { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
        );
        sections.forEach((s) => observer.observe(s));

        // Smooth anchors
        document.addEventListener("click", (e) => {
          const a = e.target.closest('a[href^="#"]');
          if (!a) return;
          const id = a.getAttribute("href");
          const el = document.querySelector(id);
          if (!el) return;
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", id);
        });
        // Scroll Reveal
        // ------------------------------
        const revealEls = document.querySelectorAll(
          ".section, .hero-grid, .project"
        );
        const revealObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("active");
                revealObs.unobserve(e.target); // reveal once
              }
            });
          },
          { threshold: 0.15 }
        );
        revealEls.forEach((el) => {
          el.classList.add("reveal");
          revealObs.observe(el);
        });



        // Year
        document.getElementById("year").textContent = new Date().getFullYear();

        // Enlarge on links & buttons
        document.querySelectorAll("a, button").forEach((el) => {
          el.addEventListener("mouseenter", () =>
            cursor.classList.add("active")
          );
          el.addEventListener("mouseleave", () =>
            cursor.classList.remove("active")
          );
        });
        // const roles = ["Designer", "Front-end Developer", "Freelancer"];
        // let i = 0,
        //   j = 0,
        //   current = "",
        //   forward = true;
        // const el = document.getElementById("typing");

        // function type() {
        //   current = roles[i];
        //   el.textContent = current.slice(0, j);

        //   if (forward) {
        //     j++;
        //     if (j > current.length) {
        //       forward = false;
        //       setTimeout(type, 1200);
        //       return;
        //     }
        //   } else {
        //     j--;
        //     if (j === 0) {
        //       forward = true;
        //       i = (i + 1) % roles.length;
        //     }
        //   }
        //   setTimeout(type, forward ? 120 : 70);
        // }
        // type();
      })();