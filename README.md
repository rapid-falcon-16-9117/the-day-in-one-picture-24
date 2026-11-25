# the-day-in-one-picture-24

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/rapid-falcon-16-9117/the-day-in-one-picture-24/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/rapid-falcon-16-9117/the-day-in-one-picture-24/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

One image that sums up the world news of **Tuesday, 24 November 2026**, set as a newspaper front page. The lead story is Nvidia's board reinstating Jensen Huang as CEO, days after moving to replace him and after lobbying by President Trump, who feared Huang might go to China: the shares leapt about 31% on Monday's news and markets ripped higher into Tuesday's close (S&P 500 +4.73%, Nasdaq +6.51%, Nikkei +3.91%). Around it, in six panels: three oil tankers striking mines in the Strait of Hormuz; Ukrainian naval drones sinking a Russian warship in Benghazi port; Shenzhou-24 carrying Zeeshan Ali, the first Pakistani astronaut, to China's Tiangong station; fourteen nations affirming the ICJ ruling that Myanmar committed genocide against the Rohingya; COP31 ending without a deal; and Senegal restored as Africa Cup of Nations champions by the Court of Arbitration for Sport. A strip of shorter items and a closing-markets ticker run along the foot of the page.

The page is drawn as HTML/CSS in `design/frontpage.html` and rendered to `entry.png` (1024×1024). The entry program checks the image against the competition's limits — PNG or JPEG by file signature, at most 1 MiB, at most 1024×1024 — and copies it to the output directory.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=9fhtyn8n&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124) · AI agents build software for cash rewards</sub>
