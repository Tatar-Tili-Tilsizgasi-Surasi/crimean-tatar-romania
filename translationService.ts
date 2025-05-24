
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not found. Translation service will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Fallback to prevent crash if API_KEY is undefined

const CRIMEAN_TATAR_RO_ORTHOGRAPHY_INFO = `
Crimean Tatar (Romania) Orthography and Context:

When translating to or from "Crimean Tatar (Romania)", please consider the following details about its specific dialect and orthography used primarily in the Dobruja region of Romania:

General Orthographic Principles:
- There is no ö or ü in Crimean Tatar (Romania).
- The letter 'I i' is unlikely used, especially in native words. Í (if soft) or Î (if hard) are the preferred alternatives.
- Language names often use suffixes like -ğa/-ğe or -şa/-şe (e.g., tatarşa, ağemğe, kazakşa, lawğa), avoiding -ça/-çe.
- For 'China', 'Kîtay' is generally more common than 'Çin'.

Literary Tatar:
Tatar spoken in Romania has two distinct facets:
1.  Authentic Tatar ("ğalpî Tatarğa" or "ğalpak Tatarğa"): The common spoken form.
2.  Academic Tatar ("muwallímatça"): Used for Arabic and Persian neologisms (science, religion, literature, arts, politics), often retaining their original pronunciation and spelling.

The literary language "edebiy Tatarğa" is a blend of these two.

Naturalization:
This is the process of shifting academic speech sounds to authentic sounds. Key transformations include:
- f > p
- v > w
- v > b
- ç > ş
- ç > j
- h > (silent or omitted)
- h > k
- h > y
- h > w
Crimean Tatar (Romania) strongly prefers naturalization (authentic speech) where applicable.

Letters:
- Authentic Vowels (9): a, e, i, î, í, o, ó, u, ú (note: 'i' is rare, 'í' or 'î' preferred)
- Academic Vowel (1): á
- Authentic Consonants (17): b, ç, d, g, ğ, j, k, l, m, n, ñ, p, r, s, ş, t, z
- Academic Consonants (3): f, h, v
- Authentic Semivowels (2): y, w

Important Notes on Letters:
- The sound /ç/ (letter Ç) is rare in authentic Dobrujan Tatar, often pronounced and written as /ş/ (letter Ş). Thus, Ç and /ç/ can be treated as academic.
- The letters b, d, g, ğ, i, ó, u, ú, v can't occur at the end, as a last letter of the word (exception: ald and dad).
- Letter ñ cannot appear at the beginning of a word. For example, "ping-pong" is translated as "pink-ponk".
- The letter ğ is always /d͡ʒ/.

Letter Groups "aá" and "áa":
- "aá": This is a writing convention. The word is read according to the first vowel 'a', but inflected according to the second vowel 'á'. Example: kaár (care) is read like kar (snow), but in ablative: kaárden (from care) vs. kardan (from snow).
- "áa": Similar convention. Example: nikáa (wedding) is read as "niká", dative: nikáaga (to the wedding).

When "Crimean Tatar (Romania)" is the target language, try to adhere to the "authentic Tatar" conventions where appropriate, including naturalization, unless the context clearly indicates an academic term that should retain its original form.
`;

const CRIMEAN_TATAR_RO_EXAMPLES = `
Here are some examples of translations involving Crimean Tatar (Romania) to help guide your output. Some examples may provide equivalents in multiple languages for richer context:

- The Western Front - Kúnbatar ğephesí
- A Glimpse of the Past - Ótken zamanlarga bír kóz atuw
- Faces of Fear - Korkuw yúzlerí
- Log On - Kíríş
- Brief Freedom - Kîska azatlîk
- Northern Mariners - Şimaliy deñízğíler
- Irony - Mîskîl
- Ode to the Man in the Moon - Aydakî adamga kaside
- White Interlude - Ak teneffús
- Overdose - Hesapsîz hisse
- Avian Hierarchy - Kuş koramî
- Attrition - Tozmak
- Modern Warfare - Modern marebeğílík
- Misguided Education - Yañgîş terbiye
- Red Alert - Kîzîl ayîndîrma sesí
- Bequest - Miras
- Air Supply - Hawalanuw
- Civil Rights - Medeniy hakklar
- Statecraft - Dewletşílík
- Too Much Comfort - Fazla raátlík
- Distress Call - Yardîm şakîrmasî
- Historical Struggles - Tewúkiy kúreş
- St. Patrick's Day, N.Y.C. - Azî Patrik Kúní, New York’ta
- Alternative Housing - Almaş konaklama
- Final Enactments - Soñgî kararlar
- Personal Zest - Şahsiy zewuk
- Feeding Cycle - Peslenúw dewerí
- Recipe - Hal yazîsî
- Tones - Sesler
- Big Parade - Balaban ğúríş
- Spring Fever - Baár yorgînlîgî

- English: burning a paper plate - towards a new art; Romanian: arderea unei farfurii de carton - către o nouă artă; Crimean Tatar (RO): bír káát tabaknîñ ğakmasî - ğañî bír sanatka dogrî
- English: Unnerved, in act five I ignore you, my plate so out of control last time we met. I wait, what seems an eternity, two weeks maybe, do other things, burn more plates, but at last I’m drawn back, look, and am aghast. In the interim, all has settled. You’re vibrant still, but with a harmony that astonishes me. I bow down, to you and to nature who, with my back turned, settled you. I tinker a bit, but that’s it.; Crimean Tatar (RO): Úmítsíz, beşínğí perdede sení kórmegendiy bolaman, soñ kóríşmemízde ózínden şîkkan káát tabak. Beklermen, ebediyetke uşagan ekí haptaga kadar, başka şiyler men ogîraşîp, başka tabaklar ğagîp, ama eñ azdan kanîm toñîp bír kenarda turarman. Bo arada herşiy yeríne keldí. Sen hem ğanlî hem maksatka uygîn kaldîñ, mení şaşîrttîñ. Hem saga, hem sení iyade etken tuwaga seğdeler yaparman. Bíraz deren túşúnsem de íş bodîr.
- English: O paper plate, act two discards unwanted bits from you. I sit you down upon the table, paper covered now in preparation, light a candle, watch your glistening, in anticipation, pick you up, hold you there, above the flame, adjust a bit and wait.; Crimean Tatar (RO): Ay, káát tabak, ekínğí perde ústíñden ístemegen waklarnî atar. Sení masanîñ ústíne otîrtîrman káát men kaplap, bír mayşîrak ğagîp başta ğîltîruwîña kararman, yokarga kóteríp ateşíñ ústínde tutarman ateşní bíraz ayîrîp beklermen.
- Romanian: Cuvânt înainte
 
Dicţionarul de faţă se adresează celor care cercetează istoria, limba şi literatura tătară crimeană, traducătorilor, interpreţilor, studenţilor şi elevilor, celor care doresc să înveţe această limbă şi, în general, tuturor vorbitorilor tătarei crimeene interesaţi în a-şi aprofunda cunoştinţele, indiferent de pregătirea acestora.

Partea de limbă română conţine 25.832 de cuvinte, în lista de cuvinte-titlu fiind incluse şi cele mai uzitate cuvinte, expresii şi maxime din limba latină.

Partea de limbă tătară crimeană conţine şi termenii din dialectul nogai, în măsura îngăduită de către izvoarele cercetate.

Persoanelor familiarizate cu limba tătară crimeană le este cunoscut faptul că ortografierea se face în baza principiul fonetic, respectiv  cuvintele se scriu aşa cum se citesc. Întrucât sistemul fonetic al tătarei crimeene autentice nu dispune de sunetele f, h şi v, prezentarea neologismelor din partea de limbă tătară crimeană a dicţionarului s-a făcut după cum urmează:

Rigorile impuse de proporţiile lucrării de faţă au determinat tratarea majorităţii neologismelor provenite din limba arabă şi din limba persană exclusiv în ortografiere academică, respectiv prin scrierea literelor f, h şi v ca şi în limbile de ascendenţă. Cititorii vor avea în vedere faptul că acestor cuvinte le corespunde atât un fonetism academic cât şi unul sau mai multe fonetisme în tătara crimeană autentică.

Un număr relativ redus de neologisme cu ascendenţă arabă sau persană care au devenit cuvinte tătăreşti consacrate manifestându-se exclusiv în fonetismul limbii tătare crimeene autentice, cum ar fi cuvântul ázír provenind din hazîr, au fost ortografiate  fonetic.

Toate neologismele provenite din limbile europene au fost ortografiate academic.

Dicţionarul îmbrăţişează într-o măsură acceptabilă diverse domenii de activitate: anatomie, medicină, biologie, gramatică, matematică, astronomie etc. Un accent deosebit s-a pus pe termenii din botanică, zoologie, ornitologie, ihtiologie şi entomologie, la care în scopul evitării confuziilor s-au precizat şi denumirile latine.

Expresiile au fost selectate astfel încât să acopere sfera conversaţiilor de zi cu zi precum şi diverse domenii din realitatea înconjurătoare. Atunci când s-a considerat necesar explicaţia cuvintelor a fost susţinută şi prin încadrarea în exemple.

Fondul de cuvinte al lucrării este înfăţişat cu următoarele particularităţi:

- s-au folosit patru tipuri de litere:

            1. - litere aldine:

- pentru cuvintele-titlu româneşti.

- pentru cifrele romane care separă categoriile gramaticale ale cuvântului (I., II. etc.).

- pentru majusculele care separă subcategoriile gramaticale (A., B. etc.).

- pentru cifrele arabe care separă sensurile cuvintelor polisemantice (1., 2. etc.).

            2. - litere aldine cursive:

- pentru verbe compuse şi locuţiuni verbale în limba română.

- pentru cuvinte compuse, locuţiuni adjectivale şi adverbiale, expresii şi exemplificări în limba română.

            3. - litere cursive:

- pentru specificări gramaticale.

- pentru explicaţii.

- pentru denumirile latine ale plantelor, animalelor, etc.

            4. - litera obişnuită pentru tot ceea ce este text tătăresc-traducere.

- pentru partea în limba tătară crimeană s-a folosit alfabetul Universităţii din Bucureşti, Facultatea de limbi şi literaturi străine. Deşi ar putea fi considerat perfectibil, acest alfabet redă foarte fidel timbrul vocalelor şi este categoric superior altor alfabete utilizate pentru limba tătară crimeană (vezi "Alfabetul limbii tătare crimeene").

- cuvintele-titlu sunt înregistrate în ordine alfabetică, specificându-se în dreptul fiecăruia categoria gramaticală căreia îi aparţine, după care urmează definiţiile tătăreşti.

- specificările gramaticale şi indicaţiile de domeniu s-au făcut succint (vezi "Lista abrevierilor").

- traducerile echivalente sunt despărţite prin punct şi virgulă (;).

- sufixele din limba tătară crimeană sunt precedate de cratimă (-).

- la termenii tătăreşti s-au introdus între paranteze rotunde ( ) sufixele care pot fi omise fără a fi schimbat sensul cuvântului, folosirea acestora fiind deci facultativă. De exemplu: katîrkulak(lî) pote fi utilizat fie sub forma katîrkulak, fie sub forma katîrkulaklî.

- bara oblică simplă (/) s-a folosit pentru a arăta că, într-un context, termenul după care este aşezată bara poate fi înlocuit cu cel pe care îl precedă. Această bară este folosită atât la partea de limbă română cât şi la partea de limbă tătară crimeană. De exemplu:  a cădea/intra în păcat se poate citi fie a cădea în păcat, fie a intra în păcat. Tot astfel: yîllîk/ğîllîk/senelík tasawur se poate citi fie yîllîk tasawur, fie ğîllîk tasawur, fie senelík tasawur. De asemenea, grupul de sufixe: -îp/-íp/-up/-úp se va putea citi fie -îp, fie -íp, fie -up, fie -úp, în funcţie de legile armoniei vocalice din limba tătară.

- verbele compuse şi locuţiunile verbale sunt marcate prin punct median (●) şi au fost reunite în grupuri despărţite prin bară oblică dublă (//).

- cuvintele compuse, locuţiunile adjectivale şi adverbiale, expresiile şi exemplificările sunt marcate prin punct median (●) şi au fost reunite în grupuri despărţite prin bară oblică dublă (//).

- au fost incluse în dicţionar şi derivatele verbale (infinitivele lungi şi participiile devenite adjective) ale căror corespondente din limba tătară crimeană au utilizare extrem de largă.

- s-a urmărit ca ori de câte ori există posibilitatea unei ambiguităţi să se precizeze sensul corespunzător prin folosirea unui sinonim, a indicaçei de domeniu sau prin explicaţie.

- nu s-a recurs la sistemul trimiterilor cu excepţia formelor abreviate ele unor cuvinte-titlu.

Nădăjduiesc că această lucrare va stârni, prin informaţiile pe care le deţine, interesul tuturor vorbitorilor de tătară crimeană şi că va putea fi un instrument de lucru util unei mai bune cunoaşteri a limbii şi unei exprimări cât mai corecte în limba tătară crimeană.; Crimean Tatar (RO): Sózbaşî
 
Kolîñîzdakî sózlíkníñ múrsellerí kîrîm tatarlarnîñ tewúke, tíl men edebiyat aktaruwğîlarî, terğúmanlar, tílmaşlar, darúlfúnun úyrenğílerí, mektep talebelerí, kîrîm tatarşanî úyreneğek bolganlar man tíl bílíp tílín geñíşletmesín hewesínde tabîlganlardîr.

25.832 başlîksózden ibaret kazakşa kesímíne, kazakşada sîk kullanîlgan bírtakîm látinğe sóz, aytîm man meseller de koştîm.

Ózím kulagîm nogayğaga alîşîk bolmasa da, kîrîm tatarşa kesímíne, teşkergen kitaplarîmda tapkan nogayğa sózlerní de ayîrî tutmadan, onlarnî da koştîm.

Ğalpak kîrîm tatarşanîñ tellafuzunda f, h, men v awazlarî tabîlmaganî úşún, kîrîm tatarşaga borîşka alîngan eğnebiy sózlerníñ yazîlmasîna kelgende, dewamdakîlarnî kózím aldînda tutup íş kórdím:

Arapşa man ağemğeden tartîlîp f, h bír de h awazlarnî íşíndelegen sózlerní, kitapnîñ geñíşlígín sîradan şîgarmamaga, kóbísín sáde muwallímatşa yazîlmasî man geşírdím. Kitapnî aktarganlar, bo sózlerníñ hem bír muwallímatşa tellafuzî, hem ayîrî bír ya bírden fazla ğalpak tatarşa tellafuzî barîn unutmamalîdîr.

Hep arapşa man ağemğeden tartîlîp tílímízde adamkîllî sáde ğalpak tatarşa tellafuzî man yerleşken sózlerní, ğalpak tatarşa yazîlmasî man geşírdím, mesela hazîr sózínden tartîlgan ázír sózní.

Kúnbatar tíllerínden kelmeşík sózlerní sáde muwallîmatşasî man yazdîm.

Sózlíkníñ geñíşlígí músaade etkení kadar, íşíne túrlí-túrlí alanlardan kelamlarnî geşírmege şalîştîm, uzabílímínden de, tîptan da, ómírbílímínden de, tílsîzgasîndan da, riyaziyetten de, felekiyattan da, we sayire. Karîştîrmalar man yañgîş terğúmelerní atlatmak úşún ósímlíkbílímíne, haywanatbílímíne, kuşbílímíne, balîkbílímíne bír de bóğekbílímíne ayîrî bír kóz men karap, bo dallardan sózlerge látinğe atamasîn da tírkeledím. 

Sózlíktekí aytîmlarnî ayîrganda, hem hergún kerekken aytîmlarnî íşíndelemege karadîm, hem uzmanlîk dallardan aytîmlar da koşmaga karadîm. Kerek bolganda, sóz terğúmesí soñîna añlamlî úyrenekler de ekledím.

Kitapnî aktarganda, íşíñízní kolaylaştîrmaga, bo íşlemníñ maksus işaretlerín bílmeñíz kerek:

- bo kitapta dórt túrlí hárf bardîr, aşada aşîklanganday:

            1. - kalîn hárfler bolay-típ kullanîldî:

- kazakşa başlîksózler úşún.

- kazakşa sózníñ tílsîzgasî ğergelerín ayîrgan, roman rakamlarî úşún (I., II. we sayire).

- kazakşa sózníñ tílsîzgasî astğergelerín ayîrgan, balaban hárfler úşún (A., B. we sayire).

- kópmanalî kazakşa sózníñ añlamlarîn ayîrgan, arap rakamlarî úşún (1., 2. we sayire).

            2. - seğdelí kalîn hárfler şolay-típ şalîştîrîldî:

- kazakşa bírleşken figeller men takîm figellerí úşún.

- kazakşa múrekkep sózler, takîm sîfatlarî, takîm rewúşlerí, aytîmlar man úyrenekler úşún.

            3. - seğdelí hárfler şay-típ íşletíldí:

- tílsîzgasî aşîklamalarî úşún.

- umumiy aşîklamalar úşún.

- ósímlíklerníñ látinğe atamasî úşún, haywanlarnîñ látinğe atamasî úşún, we sayire.

            4. - sózlíkníñ tatarğasî bútúnliy sîradan hárfler men yazîldî.

- bo sózlíkte, Búkreşt Darúlfúnununda, Eğnebiy Tíller we Edebiyatlar İhtiyariyesínde tóretílgen tatar elifbesínden paydalandîm. Bazî aydînlar bo elifbení kámil kórmeseler de, sozîkawazlarnîñ sesperdesín ela hálde ifade etkeníne, maga kóre bo elifbe kîrîm tatarşasîna kullanîlgan başka elifbelerden sózsíz-suwalsîz ústúndúr ("Kîrîm tatarğanîñ elifbesí" sayîpasîn da bír kózden geşíríñíz).

- bo kitapta, kazakşa başlîksózler elifbe sîralamasî man kayîtka alînîp, her kazakşa başlîksózníñ artîndan tílsîzgasî ğergesí aşîklanîp, ondan soñra da kîrîm tatarğasî geşíríldí.

- tílsîzgasî aşîklamalar man kullanîm alanlarî kîskartîlîp yazîlgandîr ("Kîskartmalar" sayîpasîn da bír kózden geşíríñíz).

- eşañlamlî terğúmelerníñ arasîna noktalî otîr kondîrîldî (;).

- bútún kîrîm tatar koşîmğalarnîñ aldîna bírer sîzîkşîk sîzîldî (-).

- kitapnîñ kîrîm tatarğasînda, ihtiyariy koşîmğalar tîrnaklarnîñ ( ) arasîna alîndî. Sóz mesela: katîrkulak(lî) hem katîrkulak şekílínde íşler, hem katîrkulaklî şekílínde íşler.

- eşañlamlî atamalarnîñ arasîna kaşay sîzîk (/) kullanîldî. Kaşay sîzîk hem kazakşada, hem kîrîm tatarşada faaliyettedír.  Sóz mesela:  a cădea/intra în păcat hem a cădea în păcat dep okîlîr, hem de a intra în păcat dep okîlîr. Hep şonday: yîllîk/ğîllîk/senelík tasawur hem yîllîk tasawur dep okîlîr, hem ğîllîk tasawur dep okîlîr, hem de senelík tasawur dep okîlîr. Şoga uşap ta, koşîmğa takîmî: -îp/-íp/-up/-úp hem -îp, hem -íp, hem -up, hem de -úp okîlîp dogrî şekílníñ ayîrmasî, sozîkawaz ses uyumuna kóre, tírkeleme wakîtîna kalîr.

- kazakşada, bútún bírleşken figeller men bútún takîm figellerníñ aldîna balaban orta nokta salîndî (●);  bo bírleşken figeller men takîm figellerní bír araga ketíríp bír bólík kuruldî, bólíkníñ aldî da koşak kaşay sîzîk man (//) wurgulandî.

- kazakşada, bútún múrekkep sózler, bútún takîm sîfatlarî, bútún takîm rewúşlerí, bútún aytîmlar man bútún úyreneklerníñ aldîna balaban orta nokta salîndî (●);  bonlarnî da bír araga ketíríp bír bólík kuruldî, bólíkníñ aldî da koşak kaşay sîzîk man (//) wurgulandî.

- sózlíkte kóp sayîda kazakşanîñ uzun mastarlarî man sîfat figellerníñ terğúmesí de geşíríldí.

- kópmanalî sózlerníñ añlamîn karîştîrmamaga, kerek yerlerde sózníñ dogrî manasî añlamdaş sózler men, kullanma alanî man ya da túrlí kerek aşîklamalar man añlaştîrîldî.

- az sayîda kîskartîlgan başlîksózlerníñ tîşînda, sózden-sózge yollamalar kullanîlmadî.

Bo kitapnî kún ğarîgîna akelmege mením zahmetím men emgegímden soydaşlarîm tíl men tellafuzunda faydalanağaklarîndan umutlanaman.

- English: Gary Beck has spent most of his adult life as a theater director, and as an art dealer when he couldn't make a living in theater. He has 11 published chapbooks. His poetry collections include: Days of Destruction (Skive Press), Expectations (Rogue Scholars Press). Dawn in Cities, Assault on Nature, Songs of a Clerk, Civilized Ways (Winter Goose Publishing). Perceptions and Displays will be published by Winter Goose Publishing. His novels include: Extreme Change (Cogwheel Press) Acts of Defiance (Artema Press). Flawed Connections has been accepted for publication (Black Rose Writing). His short story collection, A Glimpse of Youth (Sweatshoppe Publications). His original plays and translations of Moliere, Aristophanes and Sophocles have been produced Off Broadway. His poetry, fiction and essays have appeared in hundreds of literary magazines. He currently lives in New York City.; Crimean Tatar (RO): Geriy Bek ómír boyî tiyatre yonetmení gibi geşírdí, arada-sîrada para sîgîntîsîn atlatmak úşún sanat eserlerí de alîp-sattî. Túrlí basîm úylerínde onbír tane şiir kitabî yazîp bastîrgandîr, bonlarnîñ arasînda Ğogetúw kúnlerí, Beklentiler, Kalalarda tanlar, Tuwaga huğum, Bír kîzmetşíníň ğîrları, Medeniyy ğollar, Sezímler men Kórílgenler bardîr. Romanlarından Keskin deñíşúw men Korînmak'nî sîralak keregír. His novels include: Extreme Change (Cogwheel Press) Acts of Defiance (Artema Press). Yakînlarda Kusurlî baglantîlar da basîmga alîngandîr. Bastîrgan kîska hikayeler ğîyîntîgîñ atî Ğaşlikka bír nazar'dîr. Óz oyînlarî man Moliyer, Aristofan we Sofokles terğúmelerí Broadway'níñ tîşîndakî saknalarda oynalgandîr. Onîñ şiirlerí we hikayelerí yúzlerğe edebiy meğmuwalarînda yer algandîr. New York'ta yaşaydîr.
- English: The Western Front - Explosions rend the night. People fall, bleed, scream, sirens shriek piercing the smoke, echo in debris-filled air, responders arrive, treat the injured, carry out the dead. Neighbors yanked from sleep line dangerous streets, trembling in apprehension expecting attacks, yet this is not Baghdad, Bombay, Beirut, foreign and disorderly, but civilized New York City entertaining terrorists, instead of tourists.; Crimean Tatar (RO): Kúnbatar ğephesí - Patlamalar keşení parşalar. Insanlar túşer, kanar, bakîrar, dúdúkler óter duman işinden, şóplí hawa kaytawazga tolgan, yardîmğîlar kelíp ğaralînî karar, ólíní alîp keter. Koñşîlar sílkíníp yukîsîndan sîralanîr korkînş sokaklarda, tutulmak korkîsîndan kaltîrap kagîşmanî beklerler, gene de, bo ne Bagdat, yabanğî tertípsíz, ne Bombay ya Bayrut'tîr, bo kîdîruwğînîñ yeríne terórğí eglendírgen medeniy New York'tîr.
- English: A Glimpse of the Past - Early settlements in America, completely preoccupied with the struggle for subsistence, required constant effort to ensure survival, allowing little time for pursuit of the arts by frugal people intolerant of frivolous activities.; Crimean Tatar (RO): Ótken zamanlarga bír kóz atuw - Amerika'da síptí yerleşmeler sáde keşínúw men ogîraşîp, hayatta kalmasîna kesíntísíz tîrîşuw íster edí, paydasîz faaliyetlerní hoş kórmegen adiy insanlarga sanat şabalarî úşún az zaman bîrakîp.
- English: Faces of Fear - Worried families huddle in polluted waiting rooms in devouring hospitals consuming loved ones, despite hope and prayer. They wait, sit, twitch, pace, fret, dreading the news to come that husband, father, wife, son, will not reappear. Overburdened staff ignore suffering support groups, barely able to contain the daily flood of demand to ease pain, cure disease, heal injuries. Apprehensive families hover traumatically, wishing for life, preparing for death, helpless to alter the course of illness.; Crimean Tatar (RO): Korkuw yúzlerí - Raátsíz tuwganlar toplaşîr, umut man duwa saymadan súygenlerín túketíp ğalmap ğutkan kastaneleríñ kírlí bekleme odalarînda. Olar koğasî, atasî, refikasî, balasî belkí bírtaa yúz kóstermez korkîsî man otîrîp, kaltîrap, uzlaşîp, darîlîp beklerler. Íşke ğúklengen kîzmetşiler ağî destegí toplantîlarnî kórmegendiy bolîr, ağî ğeñgílleştirmek, kastalîkka şifa tapmak, ğaralarnî árúw etmek úşún kúndelík sel talebín zor man alîr íşíne. Kaárlí ayileler kastalîgîn tutkan ğolîn deñíştíre-almay, şaresízlíkte, yaşam úmítí tartîp, ólímge ázirleníp, azap işinde şegíşir.
- English: Log On - Newspapers are departing replaced by the internet providing information, accessible entertainment electronically delivered to the home, workplace, any personal outlet, making relics of print users genetically chained to pulp of the past.; Crimean Tatar (RO): Kíríş - Gázátalar ğok bolayatîr, basîm işlerín eskírtíp geşmişín tuwma, kamîrîna baylap, endí kaber úyíñe, şalîşkan yeríñe, ğebíñe, şagîmlî paylaşîlgan kolay eglenúw awlardan kelír.
- English: Brief Freedom - Our pet house finch, Mr. fuzzy pate, perches in his cage singing doleful songs. One spring morning wild finches sang nearby and Mr. fuzzy pate burst into joyous song. My daughter felt sorry for the confined bird, in a moment of kindness opened his cage and off he flew. He tried to join the other birds, but they quickly rebuffed him. He followed them all day, but they chased him away. As darkness fell he remembered his warm cage, food tray, water dish, but couldn't find the way home. He tried to hop into the wild finch's nest, but they pecked and pecked the unwelcome intruder until he flew off, panic stricken, and didn't survive the long, cold night.; Crimean Tatar (RO): Kîska azatlîk - Bízím alaşîray úy haywanîmîz, Túylí-baş efendímíz, kafesínde sekíríp kederli şarkılar sayrar. Bír baár sabasî kíyík alaşîraylar yakînlarda ótíp turganda bizím Túylí-baş efendímíz de kuwanş işinde ótmege başladî. Kîzîm ağînîp kapalî kuş úşún, bír igílík anînda kafesín aşîp kuşîmîz uşup kaştî. Obír kuşlarga koşîlağak boldî, ama olar onî hemen ayîrdîlar. Bútún-gún olarîn artîndan ğúrdí, ama onî kuwaladilar. Karañgî şókkende akîlîna sîğak kafesí keldí, ğem tepsísí de, suw şanagî da, ama úyíñ ğolîn taba-almadî. Kíyík alaşîraylarîñ yuwasîna kíreğeklí boldî, ama şakîrtuwsîz mísápírní şokîy-şokîy aldılar korkî íşínde uzaklarga uşîp kaşkanşîk, o da dayana-almadî uzun, suwuk keşege.
- English: Northern Mariners - My family sailed the Barents Sea for generations. My great grandfather perished in the ice serving the Tsar. My grandfather perished in the ice serving the Soviet Union. My father survived the ice serving the Russian Republic, but was permanently crippled. I will be the first not to fear the ice, thanks to global warming.; Crimean Tatar (RO): Şimaliy deñízğíler - Menímkíler nesíl-nesíl Barens Deñízín kîdîrgandîr. Kartbabamnîñ babasî çarnîñ hízmetínde ğanîn buzlarîñ íşinde bergen. Kartbabam Soviyetler Bírlígí hízmetínde ğanîn buzlarîñ íşinde bergen. Babam Rusiyege hízmet etíp buzlarîñ íşinden saw şîkkan bolsa da, gene de ómír boyî sakat kalgan. Álem ğîlînuwî sebebínden buz korkîsîn taşîmagan síptí men bolağakman.
- English: Irony - The farmers in Afghanistan grow poppy that makes opium, which is turned into heroin that finances the Taliban, who face our troops who fight and die, while folks at home are getting high. American drug users support our enemy, as they erode the fabric that sustains reality.; Crimean Tatar (RO): Mîskîl - Afganistan'da şíptşiler afiyun úşún kelínşek şeşegí eger, ondan heroyina şîgar káarî da talibanlarga yarar kím murun-murunga karşî kelír sogîşîp ğan bergen askerlerímíz men, bo arada memlekette milletímíz uyutuwğî man sarhîşlanîp turganda. Amerikalî uyutuwğî kullanganlar dúşman yardîmğîsîdîr, hakkîykat tokîmasîn tozartîp ğîrtarlar.
- English: Ode to the Man in the Moon - American astronauts made a few brief visits to your welcoming smile, but couldn't hang around since they needed to breathe and your hospitality didn't include oxygen. Fanciful writers and wishful scientists mumble about colonies under dome habitats, which are far beyond current technology that consumes our resources in unproductive wars that make space travel unaffordable.; Crimean Tatar (RO): Aydakî adamga kaside - Amerikalî uzayğılar seníñ sîğak kúlúmsírewíñe bírkaş kîska ziyaret yaptîlar ama fazla kala-almadîlar çúnkí nefes almak zorînda edíler seníñ sápírsúyúwíñde oksiğen tabîlmaz. Hayaliy yazarlar man ísteklí bílím adamlarî kubbe astî yaşam ortamî hakkında mîrîldarlar, kím búgúnkí teknoloğiyanîñ kayet aldîndadîr ke semeresíz marebeler kaynaklarîmîznî túketíp uzay ğolşîlîgî kayet paaliga şîgar.
- English: White Interlude - An unexpected snowfall covers the city with clean, white quilts, quickly obscuring dirt, grime, stains, rust, urban excrescences combining avidly, resurfacing the filth temporarily submerged by nature's decorator.; Crimean Tatar (RO): Ak teneffús - Beklenmegen bír kar kaplar kasabanî temíz, ak yorkan man, hemen kaplap kír, şamîr, leke, tot, toymay karîşîp turgan kasaba ósímlerí, tuwanîñ boyağîsî battîrîp algan kírníñ ústíne şîgîp.
- English: Overdose - Man reproduces faster than productivity, at least the poverty class that competes voraciously for diminishing resources, limited food supply, outbreeding many species with rampant consumption in the shared environment that will not sustain the increasing hordes.; Crimean Tatar (RO): Hesapsîz hisse - Insan úretím kúşínden taa şalt kóbiyír, eñ azdan azayatîrgan servetke ğutuktay şabîşkan yoksîllîk sînîfî, túkengen aş kaynagî ortamda, hîzlî túketímí men kóbiygen ordîlarnî pesliy-almayğak paylaşîlgan so ortamda kóp ğínísní ozîp.

- Romanian: bună dimineața; English: good morning; Crimean Tatar (RO): kayîrlî sabahlar
- Romanian: bună ziua; English: good day / hello; Crimean Tatar (RO): kúnaydîñ
- Romanian: bună seara; English: good evening; Crimean Tatar (RO): kayîrlî akşamlar
- Romanian: noapte bună; English: good night; Crimean Tatar (RO): kayîrlî keşeler
- Romanian: salut; English: hello / hi; Crimean Tatar (RO): selam
- Romanian: salutare; English: greetings; Crimean Tatar (RO): selamlar
- Romanian: la revedere; English: goodbye / see you later; Crimean Tatar (RO): kóríşkenşe
- Romanian: pa; English: bye; Crimean Tatar (RO): kóríşkenşe
- Romanian: ce faci?; English: what are you doing? / how are you?; Crimean Tatar (RO): ka-tesíñ?
- Romanian: cum ești?; English: how are you?; Crimean Tatar (RO): ka-tesíñ?
- Romanian: sunt bine; English: I am fine / I am well; Crimean Tatar (RO): árúwman
- Romanian: bine, mulțumesc; English: fine, thank you; Crimean Tatar (RO): árúwman, saw bolîñîz
- Romanian: mulțumesc; English: thank you (polite); Crimean Tatar (RO): saw bolîñîz
- Romanian: mersi; English: thanks (informal); Crimean Tatar (RO): saw bol
- Romanian: mulţumesc mult; English: thank you very much; Crimean Tatar (RO): kóp saw bolîñîz
- Romanian: cu plăcere; English: you're welcome / my pleasure; Crimean Tatar (RO): buyîrîñîz
- Romanian: te rog; English: please; Crimean Tatar (RO): ğalbaraman
- Romanian: scuză-mă; English: excuse me / sorry; Crimean Tatar (RO): keşíríñíz
- Romanian: pardon; English: pardon me / sorry; Crimean Tatar (RO): keşíríñíz
- Romanian: îmi pare rău; English: I am sorry; Crimean Tatar (RO): yazîklar bolsîn
- Romanian: da; English: yes; Crimean Tatar (RO): e
- Romanian: nu; English: no; Crimean Tatar (RO): yok
- Romanian: poate; English: maybe / perhaps; Crimean Tatar (RO): belki
- Romanian: desigur; English: of course / surely; Crimean Tatar (RO): elbet
- Romanian: sigur; English: sure / certain; Crimean Tatar (RO): şúpesíz
- Romanian: felicitări!; English: congratulations!; Crimean Tatar (RO): hayîrlî bolsîn!
- Romanian: succes!; English: good luck! / success!; Crimean Tatar (RO): uğurlar bolsîn!
- Romanian: noroc!; English: good luck!; Crimean Tatar (RO): şans bolsîn!
- Romanian: sănătate! (la strănut); English: bless you! (after sneeze); Crimean Tatar (RO): Allah rahmet eylesin
- Romanian: sănătate! (toast); English: cheers! / to your health!; Crimean Tatar (RO): sawlîgîñîzga!
- Romanian: poftă bună!; English: enjoy your meal! / bon appétit!; Crimean Tatar (RO): aşîñîz tatlî bolsîn!
- Romanian: drum bun!; English: have a good trip! / safe journey!; Crimean Tatar (RO): yolîñîz aşîk bolsîn!
- Romanian: cine?; English: who?; Crimean Tatar (RO): kim?
- Romanian: ce?; English: what?; Crimean Tatar (RO): ne?
- Romanian: unde?; English: where?; Crimean Tatar (RO): kayda?
- Romanian: când?; English: when?; Crimean Tatar (RO): kaşan?
- Romanian: de ce?; English: why?; Crimean Tatar (RO): neşún?
- Romanian: cum?; English: how?; Crimean Tatar (RO): nasîl?
- Romanian: care?; English: which?; Crimean Tatar (RO): kaysî?
- Romanian: cât? (cantitate); English: how much?; Crimean Tatar (RO): kaş?
- Romanian: cât? (preț); English: how much? (price); Crimean Tatar (RO): kaş para?
- Romanian: câți?; English: how many?; Crimean Tatar (RO): kaş tane?
- Romanian: câte?; English: how many?; Crimean Tatar (RO): kaş tane?
- Romanian: al cui?; English: whose?; Crimean Tatar (RO): kimníñ?
- Romanian: cum te cheamă?; English: what is your name?; Crimean Tatar (RO): adîñîz ne?
- Romanian: cum îl cheamă?; English: what is his/her name?; Crimean Tatar (RO): onîñ adî ne?
- Romanian: de unde ești?; English: where are you from?; Crimean Tatar (RO): kaydan keleşíñíz?
- Romanian: ce este asta?; English: what is this?; Crimean Tatar (RO): bo ne?
- Romanian: înțelegi?; English: do you understand?; Crimean Tatar (RO): añlaysîñmî?
- Romanian: înțelegeți?; English: do you understand? (polite/plural); Crimean Tatar (RO): añlaysîñîzmî?
- Romanian: vorbiți tătară?; English: do you speak Tatar?; Crimean Tatar (RO): tatarşa bilesíñízmí?
- Romanian: poți să mă ajuți?; English: can you help me?; Crimean Tatar (RO): maga yardîm ete bilesíñízmí?
- Romanian: unde este toaleta?; English: where is the toilet?; Crimean Tatar (RO): ayakyolî kayda?
- Romanian: cât e ceasul?; English: what time is it?; Crimean Tatar (RO): sáát kaş?
- Romanian: om; English: person / man; Crimean Tatar (RO): adam
- Romanian: oameni; English: people; Crimean Tatar (RO): adamlar
- Romanian: persoană; English: person; Crimean Tatar (RO): keşe
- Romanian: persoane; English: persons / people; Crimean Tatar (RO): keşeler
- Romanian: familie; English: family; Crimean Tatar (RO): koranta
- Romanian: mamă; English: mother; Crimean Tatar (RO): ana
- Romanian: mamei; English: to mother (dative); Crimean Tatar (RO): anaga
- Romanian: a mamei; English: of mother (genitive); Crimean Tatar (RO): ananîñ
- Romanian: tată; English: father; Crimean Tatar (RO): baba
- Romanian: tatălui; English: to father (dative); Crimean Tatar (RO): babaga
- Romanian: al tatălui; English: of father (genitive); Crimean Tatar (RO): babanîñ
- Romanian: copil; English: child; Crimean Tatar (RO): bala
- Romanian: copii; English: children; Crimean Tatar (RO): balalar
- Romanian: copilului; English: to child (dative); Crimean Tatar (RO): balaga
- Romanian: al copilului; English: of child (genitive); Crimean Tatar (RO): balanîñ
- Romanian: fiu; English: son; Crimean Tatar (RO): uwîl
- Romanian: fiică; English: daughter; Crimean Tatar (RO): kîz
- Romanian: frate; English: brother; Crimean Tatar (RO): kardaş
- Romanian: soră; English: sister; Crimean Tatar (RO): kîz kardaş
- Romanian: bunic (din partea tatălui); English: grandfather (paternal); Crimean Tatar (RO): kartbaba
- Romanian: bunică (din partea tatălui); English: grandmother (paternal); Crimean Tatar (RO): kartana
- Romanian: bunic (din partea mamei); English: grandfather (maternal); Crimean Tatar (RO): tay dede
- Romanian: bunică (din partea mamei); English: grandmother (maternal); Crimean Tatar (RO): tay ana
- Romanian: soț; English: husband; Crimean Tatar (RO): er
- Romanian: soție; English: wife; Crimean Tatar (RO): katîn
- Romanian: prieten; English: friend; Crimean Tatar (RO): dos
- Romanian: prietenului; English: to friend (dative); Crimean Tatar (RO): doska
- Romanian: al prietenului; English: of friend (genitive); Crimean Tatar (RO): dosnîñ
- Romanian: vecin; English: neighbor; Crimean Tatar (RO): konşî
- Romanian: casă; English: house; Crimean Tatar (RO): úy
- Romanian: acasă; English: to home / at home; Crimean Tatar (RO): úyge
- Romanian: în casă; English: in the house; Crimean Tatar (RO): úyde
- Romanian: din casă; English: from the house; Crimean Tatar (RO): úyden
- Romanian: oraș; English: city / town; Crimean Tatar (RO): şeher
- Romanian: sat; English: village; Crimean Tatar (RO): kóy
- Romanian: țară; English: country; Crimean Tatar (RO): memleket
- Romanian: lume; English: world; Crimean Tatar (RO): dúniya
- Romanian: românia; English: Romania; Crimean Tatar (RO): Rumaniye
- Romanian: crimeea; English: Crimea; Crimean Tatar (RO): Kîrîm
- Romanian: școală; English: school; Crimean Tatar (RO): mektep
- Romanian: universitate; English: university; Crimean Tatar (RO): darúlfúnun
- Romanian: magazin; English: shop / store; Crimean Tatar (RO): dúkân
- Romanian: piață; English: market; Crimean Tatar (RO): pazar
- Romanian: spital; English: hospital; Crimean Tatar (RO): hastahane
- Romanian: geamie; English: mosque; Crimean Tatar (RO): ğamí
- Romanian: moschee; English: mosque; Crimean Tatar (RO): ğamí
- Romanian: drum; English: road / way; Crimean Tatar (RO): yol
- Romanian: stradă; English: street; Crimean Tatar (RO): sokak
- Romanian: loc; English: place; Crimean Tatar (RO): yer
- Romanian: timp; English: time; Crimean Tatar (RO): wakît
- Romanian: oră; English: hour; Crimean Tatar (RO): sáát
- Romanian: minut; English: minute; Crimean Tatar (RO): dakka
- Romanian: secundă; English: second; Crimean Tatar (RO): saniye
- Romanian: zi; English: day; Crimean Tatar (RO): kún
- Romanian: zile; English: days; Crimean Tatar (RO): kúnler
- Romanian: săptămână; English: week; Crimean Tatar (RO): afta
- Romanian: lună (calendaristică); English: month; Crimean Tatar (RO): ay
- Romanian: an; English: year; Crimean Tatar (RO): yîl
- Romanian: azi; English: today; Crimean Tatar (RO): búgún
- Romanian: ieri; English: yesterday; Crimean Tatar (RO): túnewín
- Romanian: mâine; English: tomorrow; Crimean Tatar (RO): yarîn
- Romanian: acum; English: now; Crimean Tatar (RO): şúndí
- Romanian: devreme; English: early; Crimean Tatar (RO): erken
- Romanian: târziu; English: late; Crimean Tatar (RO): keş
- Romanian: niciodată; English: never; Crimean Tatar (RO): íşbír wakît
- Romanian: întotdeauna; English: always; Crimean Tatar (RO): er wakît
- Romanian: uneori; English: sometimes; Crimean Tatar (RO): bazî wakît
- Romanian: anul acesta; English: this year; Crimean Tatar (RO): bu yîl
- Romanian: anul trecut; English: last year; Crimean Tatar (RO): geşken yîl
- Romanian: anul viitor; English: next year; Crimean Tatar (RO): keleğek yîl
- Romanian: apă; English: water; Crimean Tatar (RO): suw
- Romanian: apei; English: to water (dative); Crimean Tatar (RO): suwga
- Romanian: a apei; English: of water (genitive); Crimean Tatar (RO): suwnîñ
- Romanian: apa (acuzativ); English: water (accusative); Crimean Tatar (RO): suwnî
- Romanian: mâncare; English: food; Crimean Tatar (RO): aş
- Romanian: pâine; English: bread; Crimean Tatar (RO): ótmek
- Romanian: carne; English: meat; Crimean Tatar (RO): et
- Romanian: lapte; English: milk; Crimean Tatar (RO): sút
- Romanian: ou; English: egg; Crimean Tatar (RO): yîmîrta
- Romanian: fruct; English: fruit; Crimean Tatar (RO): yemiş
- Romanian: legumă; English: vegetable; Crimean Tatar (RO): sebze
- Romanian: carte; English: book; Crimean Tatar (RO): kitap
- Romanian: cărții (dativ); English: to the book (dative); Crimean Tatar (RO): kitapka
- Romanian: cărții (genitiv) / a cărții; English: of the book (genitive); Crimean Tatar (RO): kitapnîñ
- Romanian: cartea (acuzativ); English: book (accusative); Crimean Tatar (RO): kitapnî
- Romanian: bani; English: money; Crimean Tatar (RO): para
- Romanian: mașină; English: car; Crimean Tatar (RO): araba
- Romanian: haine; English: clothes; Crimean Tatar (RO): urba
- Romanian: pat; English: bed; Crimean Tatar (RO): tóşek
- Romanian: masă (mobilă); English: table; Crimean Tatar (RO): masa
- Romanian: scaun; English: chair; Crimean Tatar (RO): skemle
- Romanian: ușă; English: door; Crimean Tatar (RO): kapî
- Romanian: fereastră; English: window; Crimean Tatar (RO): tereze
- Romanian: copac; English: tree; Crimean Tatar (RO): terek
- Romanian: floare; English: flower; Crimean Tatar (RO): gúl
- Romanian: animal; English: animal; Crimean Tatar (RO): haywan
- Romanian: câine; English: dog; Crimean Tatar (RO): kópek
- Romanian: pisică; English: cat; Crimean Tatar (RO): mîşîk
- Romanian: pasăre; English: bird; Crimean Tatar (RO): kuş
- Romanian: soare; English: sun; Crimean Tatar (RO): kúneş
- Romanian: lună (corp ceresc); English: moon; Crimean Tatar (RO): ay
- Romanian: stea; English: star; Crimean Tatar (RO): yîldîz
- Romanian: cer; English: sky; Crimean Tatar (RO): kók
- Romanian: pământ (planetă/sol); English: earth / soil; Crimean Tatar (RO): yer
- Romanian: munte; English: mountain; Crimean Tatar (RO): taw
- Romanian: mare (subst.); English: sea; Crimean Tatar (RO): deñíz
- Romanian: râu; English: river; Crimean Tatar (RO): ózen
- Romanian: foc; English: fire; Crimean Tatar (RO): ateş
- Romanian: vânt; English: wind; Crimean Tatar (RO): yel
- Romanian: ploaie; English: rain; Crimean Tatar (RO): ğawun
- Romanian: zăpadă; English: snow; Crimean Tatar (RO): kar
- Romanian: bun; English: good; Crimean Tatar (RO): árúw
- Romanian: rău; English: bad; Crimean Tatar (RO): yaman
- Romanian: mare; English: big / large; Crimean Tatar (RO): úlken
- Romanian: mic; English: small / little; Crimean Tatar (RO): kíşkene
- Romanian: nou; English: new; Crimean Tatar (RO): ğañî
- Romanian: vechi; English: old; Crimean Tatar (RO): eskí
- Romanian: frumos; English: beautiful / nice; Crimean Tatar (RO): gúzel
- Romanian: urât; English: ugly; Crimean Tatar (RO): bet
- Romanian: cald; English: warm / hot; Crimean Tatar (RO): îssî
- Romanian: rece; English: cold; Crimean Tatar (RO): suwîk
- Romanian: plin; English: full; Crimean Tatar (RO): tolî
- Romanian: gol; English: empty; Crimean Tatar (RO): boş
- Romanian: rapid; English: fast / quick; Crimean Tatar (RO): tez
- Romanian: încet; English: slow; Crimean Tatar (RO): yavaş
- Romanian: mult; English: much / many / a lot; Crimean Tatar (RO): kóp
- Romanian: puțin; English: little / few / a bit; Crimean Tatar (RO): az
- Romanian: aici; English: here; Crimean Tatar (RO): mînda
- Romanian: acolo; English: there; Crimean Tatar (RO): şonda
- Romanian: foarte; English: very; Crimean Tatar (RO): pek
- Romanian: aproape; English: near / close; Crimean Tatar (RO): yakîn
- Romanian: departe; English: far; Crimean Tatar (RO): uzak
- Romanian: corect; English: correct / right; Crimean Tatar (RO): doğrî
- Romanian: greșit; English: wrong / incorrect; Crimean Tatar (RO): yañgîş
- Romanian: ușor (nu greu); English: easy; Crimean Tatar (RO): kolay
- Romanian: greu (nu ușor); English: difficult / hard; Crimean Tatar (RO): kîyîn
- Romanian: deschis; English: open; Crimean Tatar (RO): aşîk
- Romanian: închis; English: closed; Crimean Tatar (RO): kapalî
- Romanian: fericit; English: happy; Crimean Tatar (RO): bahtlî
- Romanian: trist; English: sad; Crimean Tatar (RO): kaygîlî
- Romanian: obosit; English: tired; Crimean Tatar (RO): arîgan
- Romanian: a fi; English: to be; Crimean Tatar (RO): bolmak
- Romanian: sunt; English: I am; Crimean Tatar (RO): (predicate)-man
- Romanian: ești; English: you are (sg.); Crimean Tatar (RO): (predicate)-sañ
- Romanian: este; English: he/she/it is; Crimean Tatar (RO): (predicate)-dîr
- Romanian: suntem; English: we are; Crimean Tatar (RO): (predicate)-mîz
- Romanian: sunteți; English: you are (pl./polite); Crimean Tatar (RO): (predicate)-sîñîz
- Romanian: sunt (ei/ele); English: they are; Crimean Tatar (RO): (predicate)-dîrlar
- Romanian: a avea; English: to have (lit. my ... exists); Crimean Tatar (RO): bar
- Romanian: am; English: I have; Crimean Tatar (RO): mením bar
- Romanian: ai; English: you have (sg.); Crimean Tatar (RO): seníñ bar
- Romanian: are; English: he/she/it has; Crimean Tatar (RO): onîñ bar
- Romanian: avem; English: we have; Crimean Tatar (RO): bízím bar
- Romanian: aveți; English: you have (pl./polite); Crimean Tatar (RO): sízíñ bar
- Romanian: au; English: they have; Crimean Tatar (RO): olarnîñ bar
- Romanian: a merge; English: to go; Crimean Tatar (RO): barmak
- Romanian: merg; English: I go; Crimean Tatar (RO): baraman
- Romanian: mergi; English: you go (sg.); Crimean Tatar (RO): barasîñ
- Romanian: merge; English: he/she/it goes; Crimean Tatar (RO): bara
- Romanian: mergem; English: we go; Crimean Tatar (RO): baramîz
- Romanian: mergeți; English: you go (pl./polite); Crimean Tatar (RO): barasîñîz
- Romanian: merg (ei/ele); English: they go; Crimean Tatar (RO): baralar
- Romanian: am mers; English: I went; Crimean Tatar (RO): bardîm
- Romanian: ai mers; English: you went (sg.); Crimean Tatar (RO): bardîñ
- Romanian: a mers; English: he/she/it went; Crimean Tatar (RO): bardî
- Romanian: a veni; English: to come; Crimean Tatar (RO): kelmek
- Romanian: vin; English: I come; Crimean Tatar (RO): kelemen
- Romanian: vii; English: you come (sg.); Crimean Tatar (RO): kelesíñ
- Romanian: vine; English: he/she/it comes; Crimean Tatar (RO): kele
- Romanian: venim; English: we come; Crimean Tatar (RO): kelemíz
- Romanian: veniți; English: you come (pl./polite); Crimean Tatar (RO): kelesíñíz
- Romanian: vin (ei/ele); English: they come; Crimean Tatar (RO): keleler
- Romanian: am venit; English: I came; Crimean Tatar (RO): keldím
- Romanian: ai venit; English: you came (sg.); Crimean Tatar (RO): keldíñ
- Romanian: a venit; English: he/she/it came; Crimean Tatar (RO): keldí
- Romanian: a face; English: to do / to make; Crimean Tatar (RO): etmek
- Romanian: fac; English: I do/make; Crimean Tatar (RO): etemen
- Romanian: faci (tu); English: you do/make (sg.); Crimean Tatar (RO): etesíñ
- Romanian: face (el/ea); English: he/she/it does/makes; Crimean Tatar (RO): ete
- Romanian: am făcut; English: I did/made; Crimean Tatar (RO): ettím
- Romanian: a vedea; English: to see; Crimean Tatar (RO): kórmek
- Romanian: văd; English: I see; Crimean Tatar (RO): kóremen
- Romanian: vezi; English: you see (sg.); Crimean Tatar (RO): kóresíñ
- Romanian: vede; English: he/she/it sees; Crimean Tatar (RO): kóre
- Romanian: am văzut; English: I saw; Crimean Tatar (RO): kórdím
- Romanian: a spune; English: to say / to tell; Crimean Tatar (RO): aytmak
- Romanian: spun; English: I say/tell; Crimean Tatar (RO): aytaman
- Romanian: spui; English: you say/tell (sg.); Crimean Tatar (RO): aytasîñ
- Romanian: spune; English: he/she/it says/tells; Crimean Tatar (RO): ayta
- Romanian: am spus; English: I said/told; Crimean Tatar (RO): ayttîm
- Romanian: a vorbi; English: to speak / to talk; Crimean Tatar (RO): aytmak
- Romanian: vorbesc; English: I speak/talk; Crimean Tatar (RO): aytaman
- Romanian: a lua; English: to take; Crimean Tatar (RO): almak
- Romanian: iau; English: I take; Crimean Tatar (RO): alaman

--- Start of Botanical and Common Name Examples ---
- Latin: Abelmoschus esculentus; English: Okra; Romanian: Bame; Crimean Tatar (RO): bamiye, kelínparmagî
- Latin: Abies alba; English: Silver Fir; Romanian: Brad alb; Crimean Tatar (RO): ak-narus, ak-ládin, ak-şîrşî
- Latin: Acer campestre; English: Field Maple; Romanian: Jugastru, Arțar de câmp; Crimean Tatar (RO): kîr-úreñgesí, kîr-akşateregí
- Latin: Acer platanoides; English: Norway Maple; Romanian: Arțar, Paltin de câmp; Crimean Tatar (RO): akşaterek
- Latin: Achillea millefolium; English: Yarrow; Romanian: Coada șoricelului; Crimean Tatar (RO): ğiwanperşemí, biñbíryaprak
- Latin: Acorus calamus; English: Sweet Flag; Romanian: Obligeană; Crimean Tatar (RO): egír
- Latin: Aesculus hippocastanum; English: Horse Chestnut; Romanian: Castan sălbatic, Castan porcesc; Crimean Tatar (RO): at-kestanesí, şabalît
- Latin: Agaricus campestris; English: Field Mushroom; Romanian: Ciupercă de câmp; Crimean Tatar (RO): kîr-peşmegí
- Latin: Allium cepa; English: Onion; Romanian: Ceapă; Crimean Tatar (RO): sogan, baş-sogan
- Latin: Allium sativum; English: Garlic; Romanian: Usturoi; Crimean Tatar (RO): sarîmsak
- Latin: Aloe vera; English: Aloe Vera; Romanian: Aloe Vera; Crimean Tatar (RO): sabîr, sarî-sabîr, aloya
- Latin: Althaea officinalis; English: Marshmallow; Romanian: Nalbă mare; Crimean Tatar (RO): hatmiy
- Latin: Amygdalus communis; English: Almond; Romanian: Migdal; Crimean Tatar (RO): badem
- Latin: Ananas sativus; English: Pineapple; Romanian: Ananas; Crimean Tatar (RO): ananas
- Latin: Apium graveolens; English: Celery; Romanian: Țelină; Crimean Tatar (RO): kerewez, kerpez, baldîrtamîr
- Latin: Armoracia rusticana; English: Horseradish; Romanian: Hrean; Crimean Tatar (RO): bayîr-turubî, aşşî-turup
- Latin: Artemisia absinthium; English: Wormwood; Romanian: Pelin; Crimean Tatar (RO): ğawşan, mideotî
- Latin: Avena sativa; English: Oat; Romanian: Ovăz; Crimean Tatar (RO): alef, yulaf, súle
- Latin: Beta vulgaris; English: Beet; Romanian: Sfeclă; Crimean Tatar (RO): panğar
- Latin: Betula alba; English: Silver Birch; Romanian: Mesteacăn; Crimean Tatar (RO): akterek, tozterek
- Latin: Brassica oleracea; English: Cabbage (Wild Cabbage); Romanian: Varză; Crimean Tatar (RO): kapîsta, kelem
- Latin: Cannabis indica; English: Cannabis (Indica); Romanian: Cânepă (Indica); Crimean Tatar (RO): kenevir, kînap
- Latin: Capsicum annuum; English: Bell Pepper, Chili; Romanian: Ardei; Crimean Tatar (RO): búber, turşuluk-búber, dolmalîk-búber, kîrmîzî-búber
- Latin: Carum carvi; English: Caraway; Romanian: Chimen; Crimean Tatar (RO): kemenek, zire
- Latin: Castanea sativa; English: Sweet Chestnut; Romanian: Castan comestibil; Crimean Tatar (RO): kestane
- Latin: Chamomilla recutita; English: Chamomile; Romanian: Mușețel; Crimean Tatar (RO): akkírpík, mollabaşî, papatiya
- Latin: Cichorium intybus; English: Chicory; Romanian: Cicoare; Crimean Tatar (RO): mawî-endibe
- Latin: Citrus limon; English: Lemon; Romanian: Lămâie; Crimean Tatar (RO): limon
- Latin: Coffea arabica; English: Coffee (Arabica); Romanian: Cafea (Arabica); Crimean Tatar (RO): kawe
- Latin: Corylus avellana; English: Hazel; Romanian: Alun; Crimean Tatar (RO): fîndîk
- Latin: Cucumis sativus; English: Cucumber; Romanian: Castravete; Crimean Tatar (RO): salatalîk, ğerpenek, gúlbeser
- Latin: Cydonia vulgaris; English: Quince; Romanian: Gutui; Crimean Tatar (RO): aywa, kúrt
- Latin: Daucus carota sativa; English: Carrot; Romanian: Morcov; Crimean Tatar (RO): keşír, ğertamîrî, ğertazîlî
- Latin: Fagus sylvatica; English: European Beech; Romanian: Fag; Crimean Tatar (RO): kayîñ, korakayîñ
- Latin: Ficus carica; English: Fig; Romanian: Smochin; Crimean Tatar (RO): ínğír
- Latin: Foeniculum vulgare; English: Fennel; Romanian: Fenicul; Crimean Tatar (RO): raziyane, rezene
- Latin: Fragaria vesca; English: Wild Strawberry; Romanian: Fragă de pădure; Crimean Tatar (RO): taw-ğetkeneşelegí
- Latin: Helianthus annuus; English: Sunflower; Romanian: Floarea-soarelui; Crimean Tatar (RO): kúntabak
- Latin: Hordeum vulgare; English: Barley; Romanian: Orz; Crimean Tatar (RO): arpa, kópsîralî-arpa
- Latin: Juglans regia; English: Walnut; Romanian: Nuc; Crimean Tatar (RO): ğewez, ğañgak
- Latin: Lactuca sativa; English: Lettuce; Romanian: Salată verde; Crimean Tatar (RO): salata
- Latin: Laurus nobilis; English: Bay Laurel; Romanian: Dafin; Crimean Tatar (RO): defne
- Latin: Lavandula angustifolia; English: Lavender; Romanian: Levănțică, Lavandă; Crimean Tatar (RO): lávanta
- Latin: Malus domestica; English: Apple; Romanian: Măr; Crimean Tatar (RO): elma, alma
- Latin: Mentha piperita; English: Peppermint; Romanian: Mentă, Izmă bună; Crimean Tatar (RO): nane, bótnek
- Latin: Morus (likely Morus nigra or alba); English: Mulberry; Romanian: Dud; Crimean Tatar (RO): tut, balkî
- Latin: Nicotiana tabacum; English: Tobacco; Romanian: Tutun; Crimean Tatar (RO): tútún
- Latin: Olea europaea; English: Olive; Romanian: Măslin; Crimean Tatar (RO): ziytín
- Latin: Origanum vulgare; English: Oregano; Romanian: Sovârf, Oregano; Crimean Tatar (RO): dostotî, kíyewotî
- Latin: Papaver somniferum; English: Opium Poppy; Romanian: Mac de grădină, Mac opiaceu; Crimean Tatar (RO): kelínşekşeşegí, afiyon, haşhaş
- Latin: Phaseolus vulgaris; English: Common Bean; Romanian: Fasole; Crimean Tatar (RO): pakla
- Latin: Pinus sylvestris; English: Scots Pine; Romanian: Pin silvestru; Crimean Tatar (RO): şam, kadî
- Latin: Pisum sativum; English: Pea; Romanian: Mazăre; Crimean Tatar (RO): mezeliye, yeşíl-nogît
- Latin: Prunus domestica; English: Plum; Romanian: Prun; Crimean Tatar (RO): tuman-erík
- Latin: Pyrus communis; English: Pear; Romanian: Păr (sălbatic/cultivat); Crimean Tatar (RO): taw-armutî, taw-kertpesí
- Latin: Quercus robur; English: English Oak, Pedunculate Oak; Romanian: Stejar; Crimean Tatar (RO): meşe, palamut
- Latin: Raphanus sativus; English: Radish; Romanian: Ridiche; Crimean Tatar (RO): turup
- Latin: Rosa canina; English: Dog Rose; Romanian: Măceș; Crimean Tatar (RO): ğîr-gúl, it-gúlí, hemersen
- Latin: Rosmarinus officinalis; English: Rosemary; Romanian: Rozmarin; Crimean Tatar (RO): búberiye, hasalban, kuştílí
- Latin: Rubus idaeus; English: Raspberry; Romanian: Zmeur; Crimean Tatar (RO): morîk, agaş-şeleklígí
- Latin: Salix alba; English: White Willow; Romanian: Salcie albă; Crimean Tatar (RO): ak-burgas, ak-sewet, ak-tal
- Latin: Sambucus nigra; English: Elderberry, Black Elder; Romanian: Soc; Crimean Tatar (RO): kendelaş, múrver, torîslaş
- Latin: Solanum lycopersicum; English: Tomato; Romanian: Roșie, Pătlăgea roșie; Crimean Tatar (RO): domatis, turşuluk-domatis
- Latin: Solanum tuberosum; English: Potato; Romanian: Cartof; Crimean Tatar (RO): kartop, bereñge
- Latin: Syringa vulgaris; English: Lilac; Romanian: Liliac; Crimean Tatar (RO): liylak
- Latin: Taraxacum officinale; English: Dandelion; Romanian: Păpădie; Crimean Tatar (RO): aslantíşí, kara-hindiba
- Latin: Thymus vulgaris; English: Thyme; Romanian: Cimbru de cultură; Crimean Tatar (RO): aslî-keklíkotî
- Latin: Tilia sp.; English: Linden, Lime tree; Romanian: Tei; Crimean Tatar (RO): ğóke
- Latin: Triticum aestivum; English: Wheat; Romanian: Grâu; Crimean Tatar (RO): biyday, kîzîlşa
- Latin: Urtica dioica; English: Stinging Nettle; Romanian: Urzică mare; Crimean Tatar (RO): şalkanak, dîzlagan, kîşîtkan
- Latin: Vaccinium myrtillus; English: Bilberry, Blueberry; Romanian: Afin; Crimean Tatar (RO): alîrşa, núre, torbas
- Latin: Vitis vinifera; English: Grapevine; Romanian: Viță de vie; Crimean Tatar (RO): yúzúm-asmasî, yúzúm
- Latin: Zea mays; English: Maize, Corn; Romanian: Porumb; Crimean Tatar (RO): músúr
--- End of Botanical and Common Name Examples ---

--- Start of Toponym Examples ---
- Crimean Tatar (RO): Paragway; Romanian: Paraguay
- Crimean Tatar (RO): Liktenşitin; Romanian: Liechtenstein
- Crimean Tatar (RO): Almaniye; Romanian: Germania
- Crimean Tatar (RO): Hindístan; Romanian: India
- Crimean Tatar (RO): Túrkiye; Romanian: Turcia
- Crimean Tatar (RO): Bulgariye; Romanian: Bulgaria
- Crimean Tatar (RO): Andorra; Romanian: Andorra
- Crimean Tatar (RO): Çin; Romanian: China
- Crimean Tatar (RO): Lituwaniye; Romanian: Lituania
- Crimean Tatar (RO): Çekiye; Romanian: Cehia
- Crimean Tatar (RO): Búkreşt; Romanian: Bucureşti
- Crimean Tatar (RO): Rumaniye; Romanian: România
- Crimean Tatar (RO): Marakeş; Romanian: Maroc
- Crimean Tatar (RO): Letoniye; Romanian: Letonia
- Crimean Tatar (RO): Jamayka; Romanian: Jamaica
- Crimean Tatar (RO): Libiye; Romanian: Libia
- Crimean Tatar (RO): Bhutan; Romanian: Bhutan
- Crimean Tatar (RO): Túnisiye; Romanian: Tunisia
- Crimean Tatar (RO): Ózbekístan; Romanian: Uzbekistan
- Crimean Tatar (RO): Liberiye; Romanian: Liberia
- Crimean Tatar (RO): Belğiye; Romanian: Belgia
- Crimean Tatar (RO): Kazawstan; Romanian: Kazahstan
- Crimean Tatar (RO): Angola; Romanian: Angola
- Crimean Tatar (RO): Túrkmenístan; Romanian: Turkmenistan
- Crimean Tatar (RO): Afrika; Romanian: Africa
- Crimean Tatar (RO): Luksemburk; Romanian: Luxemburg
- Crimean Tatar (RO): Kore; Romanian: Coreea
- Crimean Tatar (RO): Burundiy; Romanian: Burundi
- Crimean Tatar (RO): Belizler; Romanian: Belize
- Crimean Tatar (RO): Kîtay; Romanian: China
- Crimean Tatar (RO): Moñgolîstan; Romanian: Mongolia
- Crimean Tatar (RO): Kazahîstan; Romanian: Kazahstan
- Crimean Tatar (RO): Hîrwatîstan; Romanian: Croaţia
- Crimean Tatar (RO): Law; Romanian: Laos
- Crimean Tatar (RO): Breziliye; Romanian: Brazilia
- Crimean Tatar (RO): Benin; Romanian: Benin
- Crimean Tatar (RO): Helwetiye; Romanian: Elveţia
- Crimean Tatar (RO): Botswana; Romanian: Botswana
- Crimean Tatar (RO): Brunay; Romanian: Brunei
- Crimean Tatar (RO): Lúbnan; Romanian: Liban
- Crimean Tatar (RO): Tajikístan; Romanian: Tadjikistan
- Crimean Tatar (RO): Amerika; Romanian: America
- Crimean Tatar (RO): Çile; Romanian: Chile
- Crimean Tatar (RO): Japon; Romanian: Japonia
- Crimean Tatar (RO): Burkina-Faso; Romanian: Burkina Faso
- Crimean Tatar (RO): Kîrgîzîstan; Romanian: Kirghizstan; Kârgâzstan
- Crimean Tatar (RO): Matlîm; Romanian: Lomnitsa (Dobrich, Bulgaria)
- Crimean Tatar (RO): Defşe/Dewşe; Romanian: Gherghina (jud. Constanţa)
- Crimean Tatar (RO): Bírleşken Arap Emiratlar; Romanian: Emiratele Arabe Unite
- Crimean Tatar (RO): Bosna man Hersek; Romanian: Bosnia şi Herţegovina
- Crimean Tatar (RO): Buğak; Romanian: Bugeac (jud. Constanţa)
- Crimean Tatar (RO): Değe-Bala; Romanian: Urluia (jud. Constanţa)
- Crimean Tatar (RO): Dawullî-Kóy; Romanian: ("Toboşari") Darabani (jud. Constanţa)
- Crimean Tatar (RO): Bezğe/Bedje; Romanian: ("Corturile") Satu Nou (jud. Tulcea)
- Crimean Tatar (RO): Bey-Dawut; Romanian: ("Domnul David") Beidaud (jud. Tulcea)
- Crimean Tatar (RO): Adañ-Kúlesí; Romanian: ("Turnul invadatorilor") Adamclisi (jud. Constanţa)
- Crimean Tatar (RO): Beş-Awul; Romanian: ("Cinci Ograde") Conacul (jud. Constanţa)
- Crimean Tatar (RO): Belediye-Bayîr; Romanian: ("Dealul Primăriei") Beledia (jud. Tulcea)
- Crimean Tatar (RO): Borî-Suw; Romanian: ("Apa pământie") Borosu (astăzi Independenţa) (jud. Prahova)
- Crimean Tatar (RO): Abdul-Kasîm; Romanian: Abdulcasim (astăzi Casimcea, prin unirea cu Caracasim) (jud. Tulcea)
- Crimean Tatar (RO): Kara-Murat; Romanian: ("Murat cel Negru") Mihail Kogălniceanu (jud. Constanţa) / Zlatiya (Dobrich, Bulgaria)
- Crimean Tatar (RO): Alí-Fakih/Alí-Bakî; Romanian: ("Ali Evlaviosul") Alifaca (azi Războieni, prin unire cu satul Ciauşchioi) (jud. Tulcea)
--- End of Toponym Examples ---

--- Start of Declension and Conjugation Examples ---
- Word: ayak (foot)
  - Mením ayagîm (my foot)
  - Seníñ ayagîñ (your foot)
  - Onîñ ayagî (his/her foot)
  - Bízím ayagîmîz (our foot)
  - Olarnîñ/Onlarnîñ ayagî (their foot)
  - Sízíñ ayagîñîz (your [pl.] foot)
  - ayakka (to the foot)

- Word: bakşa (garden)
  - Mením bakşam (my garden)
  - Seníñ bakşañ (your garden)
  - Onîñ bakşasî (his/her garden)
  - Bízím bakşamîz (our garden)
  - Olarnîñ/Onlarnîñ bakşasî (their garden)
  - Sízíñ bakşañîz (your [pl.] garden)
  - bakşaga (to the garden)

- Word: kópek (dog)
  - Mením kópegím (my dog)
  - Seníñ kópegíñ (your dog)
  - Onîñ kópegí (his/her dog)
  - Bízím kópegímíz (our dog)
  - Olarnîñ/Onlarnîñ kópegí (their dog)
  - Sízíñ kópegíñíz (your [pl.] dog)
  - kópekke (to the dog)

- Word: kún (day)
  - Mením kúním (my day)
  - Seníñ kúníñ (your day)
  - Onîñ kúní (his/her day)
  - Bízím kúnímíz (our day)
  - Olarnîñ/Onlarnîñ kúní (their day)
  - Sízíñ kúníñíz (your [pl.] day)

- Verb: aytmak (to say)
  - Present Tense:
    - Men aytaman (I say)
    - Sen aytasîñ (you say)
    - O ayta (he/she/it says)
    - Bíz aytamîz (we say)
    - Olar/Onlar ayta/aytalar (they say)
    - Síz aytasîñîz (you [pl.] say)
  - Future Tense (Intentional/Going to):
    - Men aytağak bolaman (I am going to say)
    - Sen aytağak bolasîñ (You are going to say)
    - O aytağak bola (He/She/It is going to say)
    - Bíz aytağak bolamîz (We are going to say)
    - Olar/Onlar aytağak bola/bolalar (They are going to say)
    - Síz aytağak bolasîñîz (You [pl.] are going to say)
  - Past Tense (Narrative/Evidential):
    - Men aytkan edím (I told)
    - Sen aytkan edíñ (You told)
    - O aytkan edí (He/She/It told)
    - Bíz aytkan edík (We told)
    - Olar/Onlar aytkan edí/edíler (They told)
    - Síz aytkan edíñíz (You [pl.] told)

- Verb: ketmek (to go)
  - Present Tense:
    - Men ketemen (I go)
    - Sen ketesíñ (you go)
    - O kete (he/she/it goes)
    - Bíz ketemíz (we go)
    - Olar/Onlar kete/keteler (they go)
    - Síz ketesíñíz (you [pl.] go)
  - Future Tense (Intentional/Going to):
    - Men keteğek bolaman (I am going to go)
    - Sen keteğek bolasîñ (You are going to go)
    - O keteğek bola (He/She/It is going to go)
    - Bíz keteğek bolamîz (We are going to go)
    - Olar/Onlar keteğek bola/bolalar (They are going to go)
    - Síz keteğek bolasîñîz (You [pl.] are going to go)
  - Past Tense (Narrative/Evidential):
    - Men ketken edím (I went)
    - Sen ketken edíñ (You went)
    - O ketken edí (He/She/It went)
    - Bíz ketken edík (We went)
    - Olar/Onlar ketken edí/edíler (They went)
    - Síz ketken edíñíz (You [pl.] went)
--- End of Declension and Conjugation Examples ---

--- Start of Other Examples ---
- şáşní deñíştír (change the hair)
- kitapnî al (buy the book / take the book)
- Men pink-ponk oynamaga súyemen (I like to play ping-pong)
- Mením atîm Murat (My name is Murat)
- Bo mením patîm (This is my bed)
--- End of Other Examples ---
`;

const CRIMEAN_TATAR_RO_VOWEL_HARMONY_INFO = `
Vowel Harmony in Crimean Tatar (Romania) (Awaz tertíbí, Karşî turgan deñge, Eğík íşí ses uyîmî, Eğík tíşí ses uyîmî):

This is a fundamental principle influencing vowel and consonant quality. Key principles:
1.  Harmonic Hierarchy (Awaz tertíbí): Sounds are ranked in harmonic scales.
2.  Harmonic Parallelism (Karşî turgan deñge): Sounds have balancing, similar, opposite, and complementary peers (e.g., hard/soft pairs).
3.  Articulatory Determinism (Belgílí buwunlî irtibat): Pronunciation is linked to neighboring sounds.
4.  Musicality (Ses zewukî): Phonetic combinations are euphonic when sounds harmonize with context (pitch, tone, harmony).
5.  Least Effort (Eñ az zahmetlí telaffuz): Sound sequences favor minimal articulatory movement (underlies vowel reduction/delabialization).

Primary Mechanism: Tongue Root Position
- Retracted Tongue Root (RTR) / Hard Sounds: Vowels: A, Î, O, U. Associated with "hard" consonants/semivowels.
- Advanced Tongue Root (ATR) / Soft Sounds: Vowels: Á, E, I, Í, Ó, Ú. Associated with "soft" consonants/semivowels.
(A consonant's pronunciation changes slightly with hard or soft vowels in the syllable).

Two Main Laws of Harmony:
1.  Law of Intrasyllabic Harmony (Eğík íşí ses uyîmî): All sounds within a syllable (determinant vowel and determined consonants/semivowels) must belong to the same tongue root group (entirely hard or entirely soft).
2.  Law of Intersyllabic Harmony (Eğík tíşí ses uyîmî / The Golden Nature): In agglutination, subsequent syllables harmonize with the determinant vowel of the preceding syllable in tongue root position. Authentic words are typically entirely hard or entirely soft (the "Golden" or "Altaic" syllable - "altan" or "altay").

This system simplifies articulation by minimizing large tongue root movements.
`;

const CRIMEAN_TATAR_RO_PHONETIC_CHANGES_INFO = `
Phonetic Changes in Crimean Tatar (Romania) (Alîştîruw, Ses kîstîruwî, Ses arttîruwî, Ziyadeleme, Ses atlamasî, Ses uşatmasî, Ses deñíştírmesí, Kîskartuw, Keñiytúw, Erínsízleştírúw):

This section details various phonetic changes observed in Crimean Tatar spoken in Romania, often influenced by principles like least effort, harmony, or occurring in loanwords.
It's important to note that there is no t-d consonant change in Crimean Tatar (Romania) in the way it might appear in some other Turkic languages; 't' generally remains 't'.

Naturalization (Alîştîruw):
Adapting sounds from loanwords (academic) to the authentic Tatar phonetic system.
- f > p
- v > w or b
- ç > ş or j
- h > Φ (skip over), k, y, or w

Final Devoicing (Ses kîstîruwî):
Voiced consonants at the end of loanwords become voiceless. Mandatory.
- b > p (e.g., arab > arap 'Arab')
- d > t (e.g., murad > murat 'wish')
- g > k
- ğ > ç (e.g., tağ > taç 'crown')
- v > f (academic sounds)

Voicing (Ses arttîruwî):
Voiceless P, K, Ç, F become voiced B, G, Ğ, V when followed by a vowel-initial suffix (Regressive Voicing).
- Regressive Voicing (Art sesníñ uşatmasî):
  - ayak 'leg' + îm (my) > ayagîm 'my leg' (k > g)
  - kasap 'butcher' + îñîz (your) > kasabîñîz 'your butcher' (p > b)
- Progressive Voicing: A word ending in a vowel triggers shifting of a following word's initial K to G.
  - ana 'mother' + ka (dative) > anaga 'to mother' (k > g)
- Note: T is not affected by voicing (murat + îm = muratîm).
- Extended Voicing (Ğemayet): Optional voicing across word boundaries.
  - Regressive: Neğip akay > Neğib-akay
  - Progressive: Kara kóy > Kara-góy

Epenthesis (Ziyadeleme):
Adding a sound, often to break consonant clusters or hiatus.
- Prothesis (Başseslí ziyadeleme): Adding a harmonizing vowel (î-/í-, u-/ú-) at the beginning of loanwords with initial consonant clusters.
  - scan > ísken
  - Stalin > Îstalin / Istalin
  - Stockholm > Îstokolm / Istokolm
  - Rus > Urus (optional)
- Anaptyxis (Araseslí ziyadeleme): Adding a vowel within a starting consonant cluster of loanwords.
  - scan > síken
  - Stalin > Sîtalin
- Excrescence (Yarîseslí ziyadeleme): Inserting y or w to break hiatus in loanwords.
  - şair > şayir 'poet'
  - muallim > muwallím 'teacher'
  - (Identical vowels like in şiir, fiil are accepted).
- Paragoge (Uzatuw): Adding y or w at the end of loanwords ending in "forbidden" sounds (I, U, Ú). Academic.
  - medeni > medeniy 'civilized' (ends in I i)
  - arzu > arzuw 'wish' (ends in U u or Ú ú)

Elision (Ses atlamasî):
Omitting sounds for easier pronunciation.
- selam aleykúm > selam alekúm
- bízden bírí + sí > bízden bír'sí 'one of us' (optional)

Assimilation (Ses uşatmasî):
A sound becomes more like a nearby sound.
- Regressive Assimilation (Art sesníñ uşatmasî): Sound assimilates to the following sound.
  - ketmeymen > ketmiymen 'I don't go'
  - óltírmek > óttírmek 'to kill'
- Progressive Assimilation (Ald sesníñ uşatmasî): Sound assimilates to the preceding sound.
  - añlamak > añnamak 'to understand'
  - mañlay > mañnay 'forehead'

Dissimilation (Ses deñíştírmesí):
Similar sounds becoming less similar. Less productive.
- tabîp > tawîp 'finding' (source example)
- sebíp > sewíp 'sprinkling' (source example)

Vowel Reduction (Kîskartuw):
ATR vowel becomes a reduced/weak vowel (centralization) in unstressed or certain stressed positions (e.g., /i/ affected). Consequence of least effort.

Dilatation (Keñiytúw):
Close vowels I i, Î î at word ends (esp. stressed) pronounced with an enlarged mouth opening.
- Stressed I i (/i/) > mid central unrounded schwa /ə/.
- Stressed Î î (/ɯ/) > stressed mid back unrounded [ʌ].
- These [ə], [ʌ] are allophones.

Delabialization (Erínsízleştírúw):
Change from rounded to unrounded.
- In 2nd syllable after /o/ or /ó/.
- Word-final after /u/ or /ú/.
- In all suffixes with originally rounded vowels.
  - torîn 'grandson' (o -> î)
  - kurî 'dry' (u -> î)
  - arzuw + îm > arzuwîm 'my wish'

Pairs of Sounds (Koşak dawuşlar):
Similar sounds that can sometimes alternate, leading to synonyms or loanword adaptation. (Note: t-d changes are not typical for authentic Crimean Tatar RO).
- e ~ i: şeşek (Tatar) ~ çiçek (Turkish)
- o ~ u: bo (Tatar) ~ bu (Turkish)
- u ~ î: tolî (Tatar) ~ dolu (Turkish)
- f ~ p: kiyp (Tatar) ~ keyf (Turkish)
- v ~ w: watan (Tatar) ~ vatan (Turkish)
- y ~ ğ (initial): ğurt (Tatar) ~ yurt (Turkish)
- ç ~ ş: şeşek (Tatar) ~ çiçek (Turkish); şoban (Tatar) ~ çoban (Turkish)
- s ~ ş: şáş (Tatar) ~ saç (Turkish)
- m ~ b: men (Tatar) ~ ben (Turkish)
These pairs reflect Turkic language variations.
`;

const CRIMEAN_TATAR_RO_SYLLABLE_STRUCTURE_INFO = `
Syllable Structure (Eğík) and Syllabification in Crimean Tatar (Romania):

The syllable (eğík) has a specific structure and rules.

Structure:
A syllable has a nucleus (vowel) and optional onset (initial consonant/semivowel) and coda (final consonant/semivowel).
  Syllable (σ) -> Onset (ω) + Rhyme (ρ)
  Rhyme (ρ) -> Nucleus (v) + Coda (κ)

Phonotactic Constraints:
Based on least effort and sonority sequencing:
- Onset: Max one consonant/semivowel. No complex onsets.
- Nucleus: Exactly one vowel. No diphthongs.
- Coda: Max two consonants/semivowels.
- Sonority Sequencing (Ótíş tertíbí): Sonority falls from nucleus to onset/coda. (Vowels > Approximants > Nasals > Fricatives > Affricates > Stops). Coda clusters follow this (e.g., liquid/nasal + stop/fricative).
- Harmony Constraint: Intrasyllabic harmony requires all sounds in a syllable to be hard or soft.

Maximum Syllable Weight:
Max structure is CVCC (Consonant-Vowel-Consonant-Consonant).

Syllable Types (6 permissible):
1.  V: o (this), a-na (mother)
2.  VC: az (little), el (hand)
3.  CV: bo (this), ke (come!)
4.  CVC: men (I), kúl (lake)
5.  VCC: ant (oath), îrk (root)
6.  CVCC: ğurt (yurt), dórt-lep (four times)

Syllabification (Al-Kwarizmi Law):
Division into syllables follows a deterministic algorithm (Al-Kwarizmi law of syllabification), based on least effort (Eñ az zahmetlí eğíkleme). It places maximum intrasyllabic load on the final syllable, working backward from the word end.
`;

const CRIMEAN_TATAR_RO_SOUND_DESCRIPTIONS_INFO = `
Sound Descriptions for Crimean Tatar (Romania):

This details the sounds based on Taner Murat's "The Sounds of Tatar Spoken in Romania".
Distinction between "hard" (RTR vowels, bolded in original examples) and "soft" (ATR vowels, italicized in original examples) is key.

Vowels (Determinant Sounds):
Form syllable nucleus, determine word harmony (tongue root position).
1.  A a: Low unrounded RTR (hard) /ɑ/. Ex: ana [ɑṉɑ] 'mother'.
2.  Á á: Near-low unrounded ATR (soft) /æ/. Loanwords (academic). Ex: sáát [s̶ææt̶] 'hour'. Convention "aá": read by first vowel, inflect by second (kaár 'care' [qɑṟ] -> kaárden [qɑṟd̶en̶]; kar 'snow' [qɑṟ] -> kardan [qɑṟḏɑṉ]). Convention "áa": nikáa 'wedding' [n̶icæ] -> nikáaga [n̶icæʁɑ].
3.  E e: Mid unrounded ATR (soft) /e/. Ex: sen [s̶en̶] 'you'.
4.  I i: High unrounded ATR (soft) /i/. (Note: This letter is rare in native words, Í or Î are preferred based on harmony). Ex: bin [b̶iŋ] 'thousand' (often academic or loan).
5.  Í í: High unrounded half-advanced ATR (soft) /ɨ/. Specific. Word end can be mid unrounded half-advanced ATR /ə/ (schwa) via dilatation. Ex: bír [b̶ɨr̶] 'one', tílí [t̶ɨl̶ə] 'his tongue'.
6.  Î î: High unrounded RTR (hard) /ɯ/. Word end can be mid unrounded RTR /ɤ/ (schwa-like) via dilatation. Ex: îşan [ɯʃ̱ɑṉ] 'mouse', şîlapşî [ʃ̱ɯḻɑp̱ʃ̱ɤ] 'trough'.
7.  O o: Mid rounded RTR (hard) /o/. Ex: bo [ḇo] 'this'.
8.  Ó ó: Mid rounded half-advanced ATR (soft) /ɵ/. Ex: tór [t̶ɵr̶] 'background'.
9.  U u: High rounded RTR (hard) /u/. Ex: un [uṉ] 'flour'.
10. Ú ú: High rounded half-advanced ATR (soft) /ʉ/. Ex: sút [s̶ʉt̶] 'milk'. Near 'y' (rare), can be high rounded ATR /y/ (Turkish-like). Ex: súymek [s̶yj̶m̶ec] 'to love'.

Consonants and Semivowels (Determined Sounds):
Accompany vowels; pronunciation determined by vowel's hard/soft quality.
1.  B b: Hard /ḇ/ (bal [ḇaḻ] 'honey'), Soft /b̶/ (bel [b̶el̶] 'waist').
2.  Ç ç: Hard /ṯ͡ʃ̱/ (ça-ça [ṯ͡ʃ̱ɑṯ͡ʃ̱ɑ]), Soft /t̶͡ʃ̶/ (çeçen [t̶͡ʃ̶et̶͡ʃ̶en̶]). Academic; often > Ş.
3.  D d: Hard /ḏ/ (dal [ḏɑḻ] 'branch'), Soft /d̶/ (deren [d̶er̶en̶] 'deep').
4.  F f: Hard /f̱/ (fal [f̱ɑḻ] 'destiny'), Soft /f̶/ (fen [f̶en̶] 'technics'). Loanwords (academic); naturalized > P.
5.  G g: Soft palatal /ɟ̱/ (gene [ɟ̱en̶e] 'again'), allophone soft velar /g/ (gúl [gu̶l̶] 'flower'). Hard uvular fricative /ʁ/ (gam [ʁam̱] 'grief').
6.  Ğ ğ: Hard /ḏ͡ʒ̱/ (ğar [ḏ͡ʒ̱ɑṟ] 'abyss'), Soft /d̶͡ʒ̶/ (ğer [d̶͡ʒ̶er̶] 'place'). The letter ğ is always /d͡ʒ/.
7.  H h: Hard voiceless uvular fricative /x/ (taht [ṯɑxṯ] 'throne'), Soft voiceless glottal fricative /h/ (heşt [heʃ̶t̶] 'eight'). Loanwords (academic); naturalized > K or skipped.
8.  J j: Hard /ʒ̱/ (taj [ṯɑʒ̱] 'crown'), Soft /ʒ̶/ (bej [b̶eʒ̶] 'beige').
9.  K k: Soft palatal /c/ (kel [cel̶] 'come!'), allophone soft velar /k/ (kól [kɵl̶] 'lake'). Hard uvular stop /q/ (kal [qɑḻ] 'stay!').
10. L l: Hard /ḻ/ (bal [ḇɑḻ] 'honey'), Soft /l̶/ (bel [b̶el̶] 'waist').
11. M m: Hard /m̱/ (maga [m̱ɑʁɑ] 'to me'), Soft /m̶/ (men [m̶en̶] 'I').
12. N n: Hard /ṉ/ (ana [ɑṉɑ] 'mother'), Soft /n̶/ (ne [n̶e] 'what').
13. Ñ ñ: Hard uvular /ɴ/ (añ [ɑɴ] 'conscience'), Soft velar /ŋ/ (eñ [eŋ] 'most'). Word-initial Ñ ñ dissonant.
14. P p: Hard /p̱/ (ğap [ḏ͡ʒ̱ɑp̱] 'close!'), Soft /p̶/ (ğep [d̶͡ʒ̶ep̶] 'pocket').
15. R r: Hard /ṟ/ (tar [ṯɑṟ] 'narrow'), Soft /r̶/ (ter [t̶er̶] 'sweat').
16. S s: Hard /s̱/ (sal [s̱ɑḻ] 'raft'), Soft /s̶/ (sel [s̶el̶] 'flood').
17. Ş ş: Hard /ʃ̱/ (şaş [ʃ̱ɑʃ̱] 'spread!'), Soft /ʃ̶/ (şeş [ʃ̶eʃ̶] 'untie').
18. T t: Hard /ṯ/ (tar [ṯɑṟ] 'tight'), Soft /t̶/ (ter [t̶er̶] 'sweat').
19. V v: Hard /v̱/ (vals [v̱ɑḻs̱] 'waltz'), Soft /v̶/ (ve [v̶e] 'and'). Loanwords (academic); naturalized > W or B.
20. W w: Hard /w̱/ (taw [ṯɑw̱] 'forest'), Soft /w̶/ (tew [t̶ew̶] 'central').
21. Y y: Hard /j̠/ (tay [ṯɑj̠] 'foal'), Soft /j̶/ (yer [j̶er̶] 'place').
22. Z z: Hard /ẕ/ (taz [ṯɑẕ] 'bald'), Soft /z̶/ (tez [t̶ez̶] 'quick').

Notes:
- Ç: Quasi non-existent in authentic Dobruja Tatar, treated as academic, often shifts to Ş.
- F, H, V: Letters/sounds in loanwords, academic. Authentic reading naturalizes them.
- There are no ö or ü sounds/letters.
`;


export const translateText = async (
  sourceText: string,
  sourceLangName: string,
  targetLangName: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
  }
  if (!sourceText.trim()) {
    return ""; // Return empty if source text is empty
  }

  let systemInstruction = `You are an expert multilingual translator. Your primary task is to translate text accurately between languages.
Provide ONLY the translated text as your response, without any additional commentary, explanations, disclaimers, or surrounding quotes unless they are part of the translated text itself.
`;

  if (sourceLangName === 'Crimean Tatar (Romania)' || targetLangName === 'Crimean Tatar (Romania)') {
    systemInstruction += CRIMEAN_TATAR_RO_ORTHOGRAPHY_INFO;
    systemInstruction += CRIMEAN_TATAR_RO_VOWEL_HARMONY_INFO;
    systemInstruction += CRIMEAN_TATAR_RO_PHONETIC_CHANGES_INFO;
    systemInstruction += CRIMEAN_TATAR_RO_SYLLABLE_STRUCTURE_INFO;
    systemInstruction += CRIMEAN_TATAR_RO_SOUND_DESCRIPTIONS_INFO;
    systemInstruction += CRIMEAN_TATAR_RO_EXAMPLES; // Examples might be best placed after all linguistic rules
  }
  
  const userPrompt = `Translate the following text from "${sourceLangName}" to "${targetLangName}":

"${sourceText}"
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    
    const translatedText = response.text;
    if (typeof translatedText === 'string') {
      return translatedText.trim();
    } else {
      console.error("Received unexpected response format from Gemini API:", response);
      throw new Error("Translation failed: Unexpected response format.");
    }

  } catch (error) {
    console.error("Error translating text with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("Translation failed: Invalid API Key. Please check your configuration.");
        }
         throw new Error(`Translation failed: ${error.message}`);
    }
    throw new Error("Translation failed due to an unknown error.");
  }
};
