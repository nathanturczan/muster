# Practical Instrument Research for an Inclusive Networked Ensemble

*Research report — July 2026*

## Purpose and framing

This report grounds instrument-support decisions for a networked-ensemble system in which a host broadcasts live scale/chord information and each participant's screen renders "which notes/frets/keys/holes/breath-directions fit right now," with a blue anticipation preview of the next harmony. The system already supports guitar (3 tunings), banjo, mandolin (2 tunings), ukulele, flute (trill charts), diatonic harmonicas in all 12 keys (with an ownership inventory), piano/keyboard, autoharp, and standard notation. The goal is maximum participation with whatever people already have, can cheaply get, or — separately — instruments that are unusually well-matched to a "which notes are allowed" display regardless of price.

Three research lenses, as requested:
1. **Already in the home** — ownership/ubiquity data.
2. **Extremely cheap to obtain** ($10–$30 new or secondhand).
3. **Especially well-suited to this system's UI**, independent of price or prevalence.

---

## 1. Already in the home: ownership and ubiquity data

### Headline ownership statistics

The best-documented long-run source is Gallup survey work commissioned by NAMM (the National Association of Music Merchants). Key findings:

- In NAMM's 2003 Gallup survey, **51% of U.S. households owned a musical instrument**, and **54% of households had a member who currently plays** ([NAMM/Gallup 2003 press release](https://www.namm.org/news/press-releases/gallup-organization-reveals-findings-american-attitudes-toward-making-music)).
- A 2006 Gallup poll for NAMM's *Music USA* Global Report found **52% of U.S. households have at least one person age 5+ who currently plays an instrument** — compared with only **37% in the UK** and **36% in Australia** — and **40% of U.S. households have two or more active musicians** ([NAMM, "Music Making on the Rise in the U.S."](https://www.namm.org/news/press-releases/music-making-rise-us)). The same report states **31% of Americans play piano** versus **28% who play guitar or bass**, making piano/keyboard nominally the single most-played instrument category in the country. It also reports the U.S. holds **42.7% of global musical-instrument purchase market share**, versus Japan's 15.6% and the UK's 6.7% — evidence that instrument density in U.S. homes is unusually high by world standards, a useful data point for the builder based in Thailand to calibrate expectations against.
- An earlier (1997) Gallup finding cited in academic literature states **two-thirds of U.S. households have had a member who currently or previously played an instrument**, representing roughly 37 million households with an active player ([UNC iSchool paper summarizing Gallup 1997](https://ils.unc.edu/MSpapers/2502.pdf)).
- More recent secondary aggregations (not primary survey data, treat as directional) put overall household instrument ownership at roughly **65–68%** and note growth in "digital instrument" (keyboard/app) ownership specifically ([ZipDo industry report](https://zipdo.co/musical-instrument-industry-statistics/); [WifiTalents industry report](https://wifitalents.com/musical-instrument-industry-statistics/)). These are lower-confidence secondary compilations, but directionally consistent with Gallup/NAMM.

**Implication:** A large majority of U.S. households have *someone's* instrument somewhere, and piano/keyboard is the single most common category to have been learned, followed closely by guitar/bass. This validates prioritizing piano/keyboard and guitar as the software's flagship-rendered instruments (already true) and suggests any "which instruments do you have" onboarding flow should default-assume a piano or guitar is more likely present than not.

### Leftover school instruments — recorders

Recorder instruction is functionally universal in U.S. elementary music curricula, typically starting in 3rd or 4th grade as a required 4–8 week unit, with schools frequently requiring or strongly encouraging each student to purchase and keep a personal recorder that goes home with them ("Recorder Karate," "Rainbow Recorder," etc., are widely used program names) ([Washoe County School District recorder unit](https://www.washoeschools.net/cms/lib08/NV01912265/Centricity/Domain/253/Fine%20Arts/Recorder%20Unit%20Teacher%20Information.pdf); [Crafty Music Maker on recorder management](https://craftymusicmaker.com/nuts-and-bolts-of-recorder-management/); [SingtoKids on recorder units](https://singtokids.com/back-to-school-prepping-for-your-recorder-unit/)). Because recorders are inexpensive ($2–$16 typically; see Section 2) and personally owned rather than school-loaned, tens of millions of American adults own or have owned a soprano recorder from childhood, and many households with school-age children currently have one in a junk drawer or backpack — making the recorder plausibly the single most latent already-owned pitched instrument outside piano/guitar, even though hard national ownership-rate data does not exist.

### School band/orchestra instruments

Formal band/orchestra participation is a smaller subset than recorder exposure but still substantial and durable:
- Roughly **21–24% of U.S. high school students** have participated in band, choir, or orchestra at some point, per national profile studies of the classes of 2004 and 2013 ([Journal of Research in Music Education, Elpus & Abril 2019](https://journals.sagepub.com/doi/10.1177/0022429419862837); [Kansas State summary of the 2004 cohort study](https://www.k-state.edu/musiceducation/phillippayne/Phillip_Payne/2013_CBC_Clinic_files/HS%20Music%20Demographics.pdf)).
- **92% of U.S. public-school students have access to some music education**, though about 3.6 million lack access entirely, per the Arts Education Data Project's first national study ([AEDP 2022 national study](https://artseddata.org/millions-of-u-s-students-denied-access-to-music-education-according-to-first-ever-national-study/)).
- Roughly **500,000–1.2 million students** participate in high-school marching band annually depending on source methodology ([WifiTalents marching band statistics](https://wifitalents.com/marching-band-statistics/); [ZipDo marching band statistics](https://zipdo.co/marching-band-statistics/)) — these are secondary compilations and should be treated as rough orders of magnitude, not precise counts.

Because band instruments (clarinet, trumpet, flute, saxophone) are rented or school-owned far more often than owned outright, and are not fixed-pitch/discrete-position instruments outside their own fingering systems, they matter mainly as a large pool of people with *prior fingering literacy* rather than as a target for new renderer support — except flute, which the system already supports.

### Inherited/abandoned pianos, keyboards, guitars, ukuleles

- Acoustic piano ownership is declining structurally: demand for new acoustic pianos has fallen sharply as electronic keyboards and software have displaced them from middle-class households, per NPR's 2025 reporting on the piano market ([NPR, "Who owns an acoustic piano these days?"](https://www.npr.org/2025/06/06/nx-s1-5417342/who-owns-a-acoustic-piano-these-days-across-the-country-less-people-are-buying-them)). This decline in *purchases* coexists with a large stock of legacy instruments already in homes — many pianos outlive the household's interest in playing them, which is precisely why "free piano" listings are a recurring phenomenon on Craigslist and Facebook Marketplace in most U.S. metro areas (evidenced by the volume of "free piano" search results across city Craigslist instances, e.g. [Chicago Craigslist "free piano" search](https://chicago.craigslist.org/search/sss?query=free+piano), and by warnings from the piano-moving industry about scam "free piano" social posts, per [Good News Network's coverage of free-piano scam warnings](https://www.goodnewsnetwork.org/if-free-pianos-show-up-in-your-feed-dont-be-duped/)). Practically: an old upright piano, unused but present, is a common feature of American homes, especially older or multi-generational households — but is immobile and non-portable, which matters for a *networked* ensemble where participants may join from wherever they are.
- Guitars are present in roughly **1 in 4–5 U.S. households** per secondary industry compilations ([WifiTalents guitar industry statistics](https://wifitalents.com/guitar-industry-statistics/)) — directionally consistent with Gallup's 28% "plays guitar or bass" figure above, though these specific ownership-rate figures come from lower-confidence aggregator sources rather than primary survey data.

### Children's musical toys

Hard ownership-rate data for toy pianos/xylophones specifically is not published by NAMM or Gallup, but adjacent data confirms the category is large and active: **96% of U.S. children ages 3–5 already listen to music regularly with parents**, and "making/listening to music" as a self-reported family hobby rose **28% since January 2021**, per The Insights Family / Toy Association trend reporting ([Toy Association, "Music Drives New Wave of Toys," 2021](https://www.toyassociation.org/PressRoom2/News/2021-news/insights-family-music-trend.aspx)). Toy pianos, toy xylophones/glockenspiels, and mini keyboards are a stable, if not separately quantified, category — functionally every household that has had a toddler in the last two decades has likely owned at least one pitched toy instrument (toy piano, xylophone, or musical toy with a keyboard layout) at some point, even if it's since been lost or broken. These items are usually **not reliably tuned** (see Section 2) and often have fewer than 8 discrete pitches, but their keyboard-like *layout* is instantly legible to the existing piano/keyboard renderer with minor adaptation for missing keys.

### Religious/holiday bell items

Handbell choirs are a fixture of many U.S. churches, and holiday jingle-bell / desk-bell sets are common seasonal purchases; while no ownership-rate survey exists, desk bells and small handbell sets are cheap, common gift items (see Section 2/3) and functionally identical in interface terms to the diatonic-harmonica-style "small fixed set" the system already handles well.

**Category 1 summary table (approximate ubiquity, cited where hard data exists):**

| Item | Ubiquity evidence | Source |
|---|---|---|
| Piano/keyboard (any form) | 31% of Americans play; largest single played-instrument category | [NAMM/Gallup 2006](https://www.namm.org/news/press-releases/music-making-rise-us) |
| Guitar/bass | 28% of Americans play; ~1 in 4-5 households own one | [NAMM/Gallup 2006](https://www.namm.org/news/press-releases/music-making-rise-us); [WifiTalents](https://wifitalents.com/guitar-industry-statistics/) |
| Any instrument in household | 51-52% of households own one; 52% have an active player | [NAMM/Gallup 2003](https://www.namm.org/news/press-releases/gallup-organization-reveals-findings-american-attitudes-toward-making-music), [2006](https://www.namm.org/news/press-releases/music-making-rise-us) |
| Soprano recorder | Near-universal elementary curriculum item, personally kept | [Washoe County recorder unit](https://www.washoeschools.net/cms/lib08/NV01912265/Centricity/Domain/253/Fine%20Arts/Recorder%20Unit%20Teacher%20Information.pdf) |
| Band/orchestra instrument literacy | 21-24% of HS students have participated | [Elpus & Abril 2019](https://journals.sagepub.com/doi/10.1177/0022429419862837) |
| Toy piano/xylophone (ever owned) | No direct % but near-universal in households with young children | [Toy Association 2021](https://www.toyassociation.org/PressRoom2/News/2021-news/insights-family-music-trend.aspx) |
| Legacy/inherited acoustic piano | Declining new purchases but large existing stock; frequent "free piano" listings | [NPR 2025](https://www.npr.org/2025/06/06/nx-s1-5417342/who-owns-a-acoustic-piano-these-days-across-the-country-less-people-are-buying-them) |

---

## 2. Extremely cheap to obtain ($10–$30)

For each instrument: typical price, tuning reliability out of the box, typical key(s), and beginner pitch-production reliability.

| Instrument | Typical price (new) | Tuning reliability | Typical key(s) | Beginner can reliably hit intended pitch? |
|---|---|---|---|---|
| **Soprano recorder (plastic)** | $2–$20; quality Yamaha/Aulos models $15–$30 ([Alibaba buying guide](https://sonusgear.alibaba.com/buyingguides/recorder-music); [Weinermusic pricing](https://store.weinermusic.com/collections/3206-plastic-recorders); [American Recorder Society survey](https://americanrecorder.org/docs/AR2406_Consumer_guide_for_teachers_FULL.pdf)) | Good on name-brand plastic (Yamaha/Aulos); bargain-bin no-name plastic can be badly out of tune | C (soprano, most common); F (sopranino/alto) | Yes for basic pitch, but breath-pressure errors easily cause octave jumps/squeaks — a real beginner failure mode |
| **Tin/penny whistle** | $8–$20 for standard brass models (Feadóg, Generation, Clarke, Waltons) ([Big Whistle buying guide](https://bigwhistle.com/best-tin-whistles/); [McNeela buyer's guide](https://blog.mcneelamusic.com/an-irish-tin-whistle-buyers-guide/)) | Generally good and consistent at this price point among established brands; sub-$10 no-name whistles less reliable | D (overwhelmingly standard) | Mostly yes; breath-control affects intonation more than on recorder because there's no register key, but the diatonic hole layout is simple |
| **Melodica** | $11–$30 for 32-key "Level 1" entry models (Eastar, Cahaya, Eastrock) ([Melodica World buying guide](https://melodicaworld.com/buying-a-melodica-in-2021/); [Bound By Flame melodica reviews 2026](https://boundbyflame.com/best-melodicas/)) | In tune, "though not perfectly," per specialist reviewers — reeds are consistent because it's a free-reed keyed instrument, not embouchure-dependent | Chromatic, full keyboard layout (typically C to F, 32 or 37 keys) | Yes — since pitch is fixed by the key pressed (like a keyboard), a total beginner reliably gets the intended pitch; only air pressure affects volume/tone, not pitch |
| **Kalimba (thumb piano)** | $10–$25 for basic 17-key models on Amazon/generic brands ([Note.com kalimba beginner guide with JPY/USD-equivalent pricing](https://note.com/carulli/n/ne58481dfd31b?hl=en)) | Ships tuned from the factory, but budget models drift and need periodic re-tuning by tapping tines with a small hammer/tool ([kalimba tuning tutorial](https://www.youtube.com/watch?v=8TJRcW0DiO0)) | Usually C major diatonic (17-key spans roughly 2 octaves) | Yes — press/pluck a tine, get exactly one fixed pitch; no embouchure or fretting skill required at all |
| **Diatonic harmonica** | Entry models $10–$20 (Hohner Blues Band ~$14–15, Silver Star ~$15, Little Lady mini ~$14) ([Eagle Music Shop pricing](https://www.eaglemusicshop.com/diatonic-harmonicas)); mid-tier Special 20/Golden Melody run $50-70+ | Reliable pitch-wise (reeds are fixed), but bending/embouchure needed for full range; basic blow/draw notes are very reliable even for total beginners | Any of the 12 keys; C most common for beginners | Yes for straight blow/draw notes (already supported by the system); bent notes require skill |
| **Boomwhackers (diatonic 8-tube set)** | $17–$36 per 8-note diatonic set depending on retailer/octave ([Music & Arts pricing](https://www.musicarts.com/boomwhackers-c-major-diatonic-scale-set-upper-octave-boomwhackers-tuned-percussion-tubes-main0016453); [The Music Shoppe](https://www.themusicshoppe.com/product/2441/boomwhackers-c-major-diatonic-scale-set-diatonic); [historical pricing breakdown](https://boomwhack.wordpress.com/2013/05/04/so-what-boomwhackers-should-i-buy/)) | Perfectly reliable — each tube is a fixed pitch by length, no tuning possible or needed | C major diatonic scale, one octave per set (color-coded to note) | Yes, 100% — striking a tube produces exactly one pitch; this is as close to foolproof as any instrument gets |
| **Desk bells / hand bells (8-note diatonic set)** | $30–$73 for a boxed 8-note diatonic desk-bell set (West Music/Rhythm Band models) ([West Music 8-note set](https://www.westmusic.com/sound-choice-hb9201-8-note-diatonic-handbell-deskbell-set-204199); [Ted Brown Music 8-note set](https://tedbrownmusic.com/rhythm-band-hand-bells-desk-bells-8-note-diatonic-rb107/)) — individual bells or smaller sets can be found nearer $10–$20 secondhand | Fixed, reliable pitch (each bell tuned at manufacture, rarely drifts) | C major diatonic, one octave | Yes — press/shake one bell, get one pitch |
| **Ocarina (4- or 6-hole)** | $13–$25 for basic plastic models ([Ocarina Workshop UK pricing](https://www.ocarina.co.uk/shop/); [Ocarina Network beginner's guide](https://theocarinanetwork.com/beginner-s-guide-to-buying-an-ocarina-t24533.html)) | Breath-pressure sensitive — pitch can drift sharp/flat with blowing force even on a good instrument, more than recorder | Alto C most common starting ocarina | Partially — finger positions are simple and few, but pitch accuracy depends on steady breath support more than most cheap instruments here |
| **Slide whistle** | Widely available $8–$15 (novelty/toy aisle item) | Poor — deliberately continuous/glissando pitch, no discrete stops | N/A (continuous pitch) | No — by design this instrument has no discrete pitches, making it the one instrument in this list fundamentally incompatible with a "does this note fit" display |
| **Toy glockenspiel** | $15–$30 for small 8–12 note toy models | Variable — inexpensive toy metallophones are frequently a few cents sharp/flat per bar and not correctable | Usually C major diatonic, sometimes chromatic additions | Partially — striking the correct bar gives a discrete, mostly-identifiable pitch, but absolute tuning accuracy is inconsistent across cheap units |
| **Small MIDI controller (mini keyboard)** | $50–$130 typically (Akai MPK Mini, Arturia MiniLab, Nektar SE25 ~$50) — slightly above the $10–30 band but worth flagging as the cheapest fully-accurate option ([PopuMusic budget MIDI roundup](https://www.popumusic.com/blogs/news/best-cheap-midi-controllers); [zZounds MIDI buying guide](https://www.zzounds.com/lp/midi-keyboard-controllers-buying-guide/200)) | Perfect — pitch is digital/quantized, cannot be out of tune | Full chromatic keyboard | Yes, 100% |

**Cross-cutting finding:** instruments with *mechanically fixed, discrete pitch generators* (boomwhackers, bells, kalimba tines, melodica reeds, MIDI keys) are close to 100% reliable for a total beginner to produce the intended pitch. Instruments relying on breath pressure and embouchure to select or stabilize pitch (ocarina, slide whistle, unassisted flute) are meaningfully less reliable even when the instrument itself is well-made and in tune. This is the central design fact for this software: fixed-pitch cheap instruments are both cheap **and** beginner-proof, making them doubly good targets, while breath/embouchure instruments need either forgiving tolerance bands in the "fits/doesn't fit" logic or should be scoped to instruments (harmonica, flute) already handled with dedicated charts.

---

## 3. Especially well suited to the system, regardless of price or ubiquity

These are instruments where the physical interface maps cleanly onto a "which notes are allowed right now" display — either because they present a small, enumerable, fixed set of pitches/chords (ideal for a simple fits/doesn't-fit readout) or because they have a clean geometric layout a renderer can mirror.

### Small fixed pitch/chord sets (ideal "readout" instruments)

- **Kalimba** — 8 to 21 tines, laid out in a simple left-right array by pitch; extremely legible on screen as a strip of lit/unlit tines. Prices for entry kalimbas run **$10–$25** ([kalimba pricing survey](https://note.com/carulli/n/ne58481dfd31b?hl=en)).
- **Steel tongue drum** — 8–15 fixed notes per drum, entry-level instruments run **$60–$120** for 8–11 note models, with mid-range ($150-250) and premium ($280-400+) tiers scaling up note count and build quality ([Healing Sounds steel tongue drum buying guide](https://healing-sounds.com/blogs/tongue-drum/choose-first-steel-tongue-drum)). The circular tongue layout maps directly to a radial or circular UI.
- **Handpan/hang drum** — the single best example of "genuinely well-suited but rare/pricier" per the task's explicit weighting instruction. A handpan has a small (7–11 note) fixed diatonic/pentatonic scale arranged radially around a central "ding" note, and playing technique is entirely about *which tone field you strike*, not pitch production — a perfect conceptual match for a "these notes are lit up" display. However, it is expensive: quality instruments run **$1,000–$3,000+**, with sub-$1,000 "beginner series" instruments from makers like Aura Handpans starting around **$875–$900**, and mass-produced sub-$300 Amazon/Guitar Center handpan-style drums existing but frequently arriving out of tune or with poor sustain ([Cosmos Handpan buyer's guide](https://www.cosmoshandpan.com/blogs/news/the-handpan-buyers-guide-everything-you-need-to-know-before-purchasing); [MAG Instruments cost guide](https://maginstruments.com/cheap-and-affordable-handpan/); [Reddit r/handpan budget beginner discussion](https://www.reddit.com/r/handpan/comments/1pe8572/budget_friendly_beginner_handpan/); [Planet Handpan budget guide](https://www.planethandpan.com/post/best-handpans-for-every-budget)). Given the explicit instruction to weight suitability equally with cost, the handpan deserves dedicated renderer support (a radial layout showing which of its 8-10 fixed tones are currently in-harmony) despite its rarity and price.
- **Handbell / handchime sets and desk bells** — inherently one-bell-one-pitch; classroom sets of 8 (diatonic) to 25 (chromatic) notes are standard, priced roughly **$30–$75** for an 8-note diatonic desk-bell set and scaling up for full choir sets ([West Music handbell pricing](https://www.westmusic.com/sound-choice-hb9201-8-note-diatonic-handbell-deskbell-set-204199); [Music is Elementary handbell catalog](https://musiciselementary.com/product-category/bells/hand-bells/)). Already conceptually identical to the harmonica-inventory model the system uses.
- **Boomwhackers** — fixed-pitch tubes, cannot be mistuned, and the entire "instrument" is really just an array of discrete pitches a player selects by which tube they grab — arguably the most literal embodiment of a "fits/doesn't fit" interface possible. **$17–$36** per 8-note diatonic set ([Music & Arts pricing](https://www.musicarts.com/boomwhackers-c-major-diatonic-scale-set-upper-octave-boomwhackers-tuned-percussion-tubes-main0016453)).
- **Orff instruments (xylophones, metallophones, glockenspiels with removable bars)** — purpose-built for exactly this use case: bars can be physically removed to restrict the instrument to only the notes in the current scale, meaning the *instrument itself* can be reconfigured in sync with the software's harmony display, not just read from a screen. This is a uniquely strong match. Classroom sets are pricier ($150+) but small diatonic glockenspiels can be found for $30-60.
- **Autoharp / chorded zither** — already supported by the system, and worth reinforcing here: it converts an entire chord into a single strum gesture via chord-bar buttons, which is the cleanest possible hardware analogy to "which chord is allowed right now." Entry-level models (Oscar Schmidt OS700, Hohner Special 21) run **$180–$300**; used vintage autoharps are available **$125–$350** ([Alibaba autoharp buying guide](https://sonusgear.alibaba.com/buyingguides/autoharp); [Folkstrings.com pricing comparison](https://folkstrings.com/autoharp-vs-zither/)).

### Spatial-layout instruments with clean geometric mapping

- **Hammered dulcimer** — strings arranged in two crossing diatonic (Guitar-Zither-style) bridges, producing a highly regular, mappable grid not unlike a fretboard laid flat. A genuinely excellent fit for a geometric renderer despite being a specialty instrument. Beginner instruments run **$450–$600** (e.g., Dusty Strings, Atlas 12/11), with cheaper compact models occasionally under $300 ([Hobgoblin Music hammered dulcimer listings](https://hobgoblin.com/fretted-and-stringed-instruments/autoharps-zithers-and-dulcimers)). Notably, Thailand and the wider Mekong region have a close relative already embedded in local musical culture: the **khim**, a Thai/Cambodian hammered dulcimer, meaning this renderer would have direct cultural relevance for Thailand-based users and could double as a khim renderer ([Hobgoblin listing referencing the Thai khim as "similar to a hammered dulcimer"](https://hobgoblin.com/fretted-and-stringed-instruments/autoharps-zithers-and-dulcimers)).
- **Mountain (Appalachian) dulcimer** — diatonic fretting (not chromatic), so unlike guitar it has a smaller, simpler fret-position-to-pitch mapping that is arguably easier to render than a fully chromatic fretboard. Beginner instruments run **$100–$300** ([ArtistWorks buyer's guide](https://blog.artistworks.com/mountain-dulcimer-basics-for-guitar-players/); [Hill Diaries pricing guide](https://hilldiaries.com/mountain-dulcimer-instruments/)).
- **MIDI controllers / small keyboard controllers** — fully chromatic, perfectly quantized pitch, and directly reusable by the existing piano/keyboard renderer with zero adaptation. Budget units (Nektar SE25, Akai MPK Mini) run **$50–$130** ([PopuMusic MIDI controller roundup](https://www.popumusic.com/blogs/news/best-cheap-midi-controllers)). Because pitch accuracy is perfect and layout is identical to piano, this is arguably the *most* system-friendly instrument category that exists, constrained only by needing a computer/MIDI host nearby.
- **Melodica** — effectively a breath-powered miniature piano keyboard; reuses the piano renderer directly, with the caveat of a smaller key range.

**Section 3 shortlist rationale:** the common thread across all of these is that the instrument's own physical constraints do the "which notes are valid" filtering work that a guitar or piano cannot do on its own — either by offering only a few notes (kalimba, bells, boomwhackers, handpan), by allowing physical reconfiguration to match the harmony (Orff bars), or by having a geometry so regular that a renderer overlay is nearly a direct copy of the instrument face (hammered/mountain dulcimer, MIDI controller).

---

## 4. International note: Thailand and Southeast Asia

Because the builder is based in Thailand, three differences are worth flagging:

- **Overall instrument ownership skews lower outside North America.** Global ownership rate is estimated around 31%, compared to roughly 45% in North America — a wide gap suggesting the "assume most participants own something" logic calibrated on U.S. Gallup data should not be applied uncritically to a Thailand-based or globally distributed user base ([ZipDo global ownership comparison](https://zipdo.co/musical-instrument-industry-statistics/)).
- **Recorder/band-instrument school culture is far less universal outside the US/UK/Commonwealth education systems**, so the "leftover school recorder" pipeline that is nearly guaranteed in an American household cannot be assumed for Thai participants.
- **Thailand has native fixed-pitch and small-set instruments that map naturally onto this system's philosophy** even though they're not currently supported: the **khim** (Thai hammered dulcimer, a close cousin of the hammered dulcimer already discussed above, and commonly available secondhand — e.g., **£225–£350** in the UK secondary market, suggesting even lower local prices in Thailand) ([Hobgoblin Music khim listings](https://hobgoblin.com/fretted-and-stringed-instruments/autoharps-zithers-and-dulcimers)), and instruments referenced in overviews of Thai/Isan traditional instruments such as the khaen (free-reed mouth organ) ([Center for World Music overview of the Lao/Isan khaen](https://centerforworldmusic.org/2016/01/world-music-instrument-the-lao-khaen/); [Wikipedia: Traditional Thai musical instruments](https://en.wikipedia.org/wiki/Traditional_Thai_musical_instruments)). These represent a natural expansion path if the software is localized for Southeast Asian ensembles, and the khim in particular could share a renderer with the hammered dulcimer given their structural similarity.

---

## 5. Combined ranking: top 15 instruments

Balancing household ubiquity, low cost, out-of-the-box pitch reliability, beginner success rate, and fit with the "which notes work right now" display. **The renderer tag is the most important column** — it determines whether an instrument needs a dedicated geometric renderer (SPATIAL) or can be served by a generalized "does this note/chord fit" readout (FIXED SET).

| Rank | Instrument | Ubiquity/cost basis | Pitch reliability | Beginner success | Renderer tag |
|---|---|---|---|---|---|
| 1 | **Piano / keyboard** | Most-played instrument in US homes (31%) ([NAMM/Gallup](https://www.namm.org/news/press-releases/music-making-rise-us)); already supported | Perfect (fixed pitch per key) | Very high | **SPATIAL** (keyboard layout) |
| 2 | **Guitar** | 28% play guitar/bass; ~1 in 4-5 households own one ([NAMM/Gallup](https://www.namm.org/news/press-releases/music-making-rise-us); [WifiTalents](https://wifitalents.com/guitar-industry-statistics/)); already supported | Depends on player's intonation/fretting, but fretted positions are discrete | Moderate (fretting skill required) | **SPATIAL** (fretboard) |
| 3 | **Soprano recorder** | Near-universal school exposure; $2-$30 | Good on name-brand plastic | High for basic notes, moderate for octave control | **SPATIAL** (small, but has a finger-hole geometry — closer to a simplified fretboard than a fixed-set readout) |
| 4 | **Diatonic harmonica** | Already supported in all 12 keys; $10-20 entry models | Reliable for blow/draw notes | High for straight notes | **FIXED SET** (already modeled this way) |
| 5 | **Ukulele** | Common inherited/gift instrument; already supported | Discrete fretted pitches | High — fewer/softer strings than guitar, easier for beginners | **SPATIAL** (fretboard) |
| 6 | **Kalimba** | Extremely cheap ($10-25), and one of the best-suited instruments for this system | Good out of box, may need occasional retuning | Very high — literally cannot miss a pitch | **FIXED SET** |
| 7 | **Melodica** | $11-30 entry models; keyboard-equivalent layout | In tune, reed-based, consistent | Very high (fixed pitch per key like a keyboard) | **SPATIAL** (miniature keyboard) |
| 8 | **Boomwhackers (diatonic set)** | $17-36 per set; cannot be mistuned | Perfect | Highest possible — one tube, one pitch | **FIXED SET** |
| 9 | **Desk bells / handbells (8-note diatonic)** | $30-75 for classroom sets; common in schools/churches | Fixed, rarely drifts | Very high | **FIXED SET** |
| 10 | **Autoharp** | Already supported; $180-300 new, $125-350 used | Fixed chords via bars | High — press button, strum, get chord | **FIXED SET** (chord-based) |
| 11 | **MIDI controller (small/mini keyboard)** | $50-130; perfect digital pitch | Perfect | Very high | **SPATIAL** (keyboard layout — directly reuses piano renderer) |
| 12 | **Toy piano / toy xylophone** | Near-universal at some point in households with young children; often free/inherited | Variable — cheap units frequently mistuned | Moderate (layout is intuitive, but absolute pitch may be off) | **SPATIAL** or **FIXED SET** depending on model (keyboard-style toy pianos are spatial; single-octave toy xylophones are fixed-set) |
| 13 | **Steel tongue drum** | $60-120 entry-level; excellent conceptual fit despite moderate price | Good — tuned at manufacture | Very high | **FIXED SET** |
| 14 | **Mandolin** | Already supported (2 tunings); moderately common among folk/bluegrass hobbyists | Discrete fretted pitches | Moderate | **SPATIAL** (fretboard) |
| 15 | **Handpan** | Rare and expensive ($900-3000+), but exceptionally well-suited; included per explicit suitability-weighting instruction | Excellent — tuned at manufacture by specialist makers | Very high (strike a tone field, get exactly that note) | **FIXED SET** |

---

## 6. High-suitability standouts (regardless of cost or ubiquity)

These instruments should be prioritized for renderer support *because of how well their physical interface matches the software's core interaction model* — "which notes are allowed right now" — even though they are neither cheap nor common:

1. **Handpan / hang drum** — a small fixed set of tone fields arranged radially; playing is 100% about which field you strike, never about intonation. The single cleanest hardware analog to a "lit-up notes" display in this entire survey. Price: **$875–$3,000+** ([Cosmos Handpan buyer's guide](https://www.cosmoshandpan.com/blogs/news/the-handpan-buyers-guide-everything-you-need-to-know-before-purchasing); [Planet Handpan budget guide](https://www.planethandpan.com/post/best-handpans-for-every-budget)).
2. **Hammered dulcimer** (and its Thai cousin, the **khim**) — a highly regular two-bridge string grid that a screen can mirror almost literally, string for string. Price: **$450–$600** new ([Hobgoblin hammered dulcimer listings](https://hobgoblin.com/fretted-and-stringed-instruments/autoharps-zithers-and-dulcimers)); the khim is available secondhand from roughly **£225** ([Hobgoblin khim listing](https://hobgoblin.com/fretted-and-stringed-instruments/autoharps-zithers-and-dulcimers)).
3. **Orff instruments with removable bars** (xylophones, metallophones, glockenspiels) — uniquely able to be *physically reconfigured* to match the current harmony by removing out-of-scale bars, not just displayed on screen. No other instrument in this survey offers that property.
4. **Steel tongue drum** — same radial fixed-tone-field logic as the handpan at a much lower price point ($60-120 entry level), making it a good "handpan-lite" recommendation for cost-conscious users who want that interaction style ([Healing Sounds buying guide](https://healing-sounds.com/blogs/tongue-drum/choose-first-steel-tongue-drum)).
5. **Mountain dulcimer** — diatonic (not chromatic) fretting gives a smaller, simpler position-to-pitch grid than guitar, making it an easier spatial-renderer target while still being a "real" chordal/melodic instrument. Price: **$100-300** ([ArtistWorks guide](https://blog.artistworks.com/mountain-dulcimer-basics-for-guitar-players/)).
6. **MIDI controllers** — perfect digital pitch and a layout that is a strict subset of the existing piano renderer; effectively zero-risk to support and should be treated as a "free win" alongside piano.

---

## Sources consulted

- [NAMM/Gallup 2003 press release](https://www.namm.org/news/press-releases/gallup-organization-reveals-findings-american-attitudes-toward-making-music)
- [NAMM, "Music Making on the Rise in the U.S." (2006)](https://www.namm.org/news/press-releases/music-making-rise-us)
- [UNC iSchool paper citing 1997 Gallup data](https://ils.unc.edu/MSpapers/2502.pdf)
- [ZipDo musical instrument industry statistics](https://zipdo.co/musical-instrument-industry-statistics/)
- [WifiTalents musical instrument industry statistics](https://wifitalents.com/musical-instrument-industry-statistics/)
- [WifiTalents guitar industry statistics](https://wifitalents.com/guitar-industry-statistics/)
- [NPR: "Who owns an acoustic piano these days?" (2025)](https://www.npr.org/2025/06/06/nx-s1-5417342/who-owns-a-acoustic-piano-these-days-across-the-country-less-people-are-buying-them)
- [Good News Network: free-piano scam warnings](https://www.goodnewsnetwork.org/if-free-pianos-show-up-in-your-feed-dont-be-duped/)
- [Chicago Craigslist "free piano" search results](https://chicago.craigslist.org/search/sss?query=free+piano)
- [Washoe County School District recorder unit teacher info](https://www.washoeschools.net/cms/lib08/NV01912265/Centricity/Domain/253/Fine%20Arts/Recorder%20Unit%20Teacher%20Information.pdf)
- [Crafty Music Maker: recorder management](https://craftymusicmaker.com/nuts-and-bolts-of-recorder-management/)
- [SingtoKids: prepping for recorder unit](https://singtokids.com/back-to-school-prepping-for-your-recorder-unit/)
- [Journal of Research in Music Education: Elpus & Abril 2019, high school music enrollment](https://journals.sagepub.com/doi/10.1177/0022429419862837)
- [Kansas State summary of 2004 HS music demographics study](https://www.k-state.edu/musiceducation/phillippayne/Phillip_Payne/2013_CBC_Clinic_files/HS%20Music%20Demographics.pdf)
- [Arts Education Data Project: 2022 national access study](https://artseddata.org/millions-of-u-s-students-denied-access-to-music-education-according-to-first-ever-national-study/)
- [WifiTalents marching band statistics](https://wifitalents.com/marching-band-statistics/)
- [ZipDo marching band statistics](https://zipdo.co/marching-band-statistics/)
- [Toy Association: "Music Drives New Wave of Toys" (2021)](https://www.toyassociation.org/PressRoom2/News/2021-news/insights-family-music-trend.aspx)
- [Alibaba recorder buying guide](https://sonusgear.alibaba.com/buyingguides/recorder-music)
- [Weinermusic plastic recorder pricing](https://store.weinermusic.com/collections/3206-plastic-recorders)
- [American Recorder Society plastic soprano recorder consumer survey](https://americanrecorder.org/docs/AR2406_Consumer_guide_for_teachers_FULL.pdf)
- [Big Whistle tin whistle buying guide](https://bigwhistle.com/best-tin-whistles/)
- [McNeela Music tin whistle buyer's guide](https://blog.mcneelamusic.com/an-irish-tin-whistle-buyers-guide/)
- [Melodica World buying guide](https://melodicaworld.com/buying-a-melodica-in-2021/)
- [Bound By Flame melodica reviews 2026](https://boundbyflame.com/best-melodicas/)
- [Note.com kalimba beginner buying guide](https://note.com/carulli/n/ne58481dfd31b?hl=en)
- [YouTube: kalimba tuning tutorial](https://www.youtube.com/watch?v=8TJRcW0DiO0)
- [Eagle Music Shop diatonic harmonica pricing](https://www.eaglemusicshop.com/diatonic-harmonicas)
- [Music & Arts boomwhackers pricing](https://www.musicarts.com/boomwhackers-c-major-diatonic-scale-set-upper-octave-boomwhackers-tuned-percussion-tubes-main0016453)
- [The Music Shoppe boomwhackers pricing](https://www.themusicshoppe.com/product/2441/boomwhackers-c-major-diatonic-scale-set-diatonic)
- [Boomwhacking the World: historical pricing breakdown](https://boomwhack.wordpress.com/2013/05/04/so-what-boomwhackers-should-i-buy/)
- [West Music 8-note diatonic handbell set](https://www.westmusic.com/sound-choice-hb9201-8-note-diatonic-handbell-deskbell-set-204199)
- [Ted Brown Music 8-note handbell set](https://tedbrownmusic.com/rhythm-band-hand-bells-desk-bells-8-note-diatonic-rb107/)
- [Music is Elementary handbell catalog](https://musiciselementary.com/product-category/bells/hand-bells/)
- [Ocarina Workshop UK pricing](https://www.ocarina.co.uk/shop/)
- [The Ocarina Network beginner's buying guide](https://theocarinanetwork.com/beginner-s-guide-to-buying-an-ocarina-t24533.html)
- [PopuMusic cheap MIDI controllers roundup](https://www.popumusic.com/blogs/news/best-cheap-midi-controllers)
- [zZounds MIDI keyboard controller buying guide](https://www.zzounds.com/lp/midi-keyboard-controllers-buying-guide/200)
- [Healing Sounds steel tongue drum buying guide](https://healing-sounds.com/blogs/tongue-drum/choose-first-steel-tongue-drum)
- [Cosmos Handpan buyer's guide](https://www.cosmoshandpan.com/blogs/news/the-handpan-buyers-guide-everything-you-need-to-know-before-purchasing)
- [MAG Instruments handpan cost guide](https://maginstruments.com/cheap-and-affordable-handpan/)
- [Reddit r/handpan: budget beginner handpan discussion](https://www.reddit.com/r/handpan/comments/1pe8572/budget_friendly_beginner_handpan/)
- [Planet Handpan budget guide](https://www.planethandpan.com/post/best-handpans-for-every-budget)
- [Alibaba autoharp buying guide](https://sonusgear.alibaba.com/buyingguides/autoharp)
- [Folkstrings.com autoharp vs zither pricing comparison](https://folkstrings.com/autoharp-vs-zither/)
- [ArtistWorks mountain dulcimer buyer's guide](https://blog.artistworks.com/mountain-dulcimer-basics-for-guitar-players/)
- [Hill Diaries mountain dulcimer pricing guide](https://hilldiaries.com/mountain-dulcimer-instruments/)
- [Hobgoblin Music autoharps/zithers/dulcimers catalog (includes Thai khim listings)](https://hobgoblin.com/fretted-and-stringed-instruments/autoharps-zithers-and-dulcimers)
- [Center for World Music: the Lao/Isan khaen](https://centerforworldmusic.org/2016/01/world-music-instrument-the-lao-khaen/)
- [Wikipedia: Traditional Thai musical instruments](https://en.wikipedia.org/wiki/Traditional_Thai_musical_instruments)
