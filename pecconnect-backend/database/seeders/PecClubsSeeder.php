<?php

namespace Database\Seeders;

use App\Models\Club;
use Illuminate\Database\Seeder;

class PecClubsSeeder extends Seeder
{
    /**
     * Seed all official Technical Societies, Cultural Clubs, 
     * Editorial Boards, and Service Cells of Punjab Engineering College.
     * Sources: https://pec.ac.in/students/technical-societies & https://pec.ac.in/cultural-clubs
     */
    public function run(): void
    {
        // Clean up any legacy dummy codes
        $legacyCodes = ['CCPEC', 'ROBO', 'AAROHAN', 'ENACTUS', 'FCPEC', 'DESIGN', 'ESPORTS'];
        Club::whereIn('code', $legacyCodes)->delete();

        $clubs = [
            // ==========================================
            // 💻 TECHNICAL SOCIETIES & STUDENT CHAPTERS
            // ==========================================
            [
                'name' => 'IEEE Student Branch (IEEE PEC)',
                'code' => 'IEEE',
                'category' => 'technical',
                'description' => 'Premier electrical, electronics, and computing society. Hosts workshops, hackathons, and the flagship annual technical fest Techadroit.',
                'members_count' => 450,
                'icon_name' => 'hardware-chip',
                'color' => '#00629B',
                'instagram_handle' => 'ieee_pec',
            
                'long_description' => 'IEEE PEC, one of the largest technical societies at PEC, is an exemplary platform for students to polish their technical skillset and helps them in their personal professional growth. IEEE organizes various workshops, events extensively covering various domains whether it’s coding, programming skills in C++, Arduino or Hardware workshops for designing and building various bots. With 100+ active members, IEEE-PEC has been the strongest technical society not only in institute but entire region, for years it has served as a platform, with objective of spreading knowledge for enhancement of computer science, electrical and electronics engineers. From Guest lectures from Industry experts to providing a quality and competitive environment, IEEE has done it all. We have organized various coding competitions with online platforms like Hackerrank and have participated in various national level events as well.

IEEE PEC Student Chapter conducted its flagship event Techadroit from 1st – 3rd April 2022. Techadroit was a 3 days long amalgamation of competitions and webinars.

First Event included a 24-hour long event Software Hackathon. The challenge is to work on a real life problem and provide a template for a practical solution to those problems/startups using latest technologies and integrate them to provide a real solution.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/ieee',
            ],
            [
                'name' => 'ACM Student Chapter (ACM PEC)',
                'code' => 'ACM',
                'category' => 'technical',
                'description' => 'The computing society driving algorithmic problem-solving, open-source development, systems programming, and competitive hackathons.',
                'members_count' => 420,
                'icon_name' => 'code-slash',
                'color' => '#0085CA',
                'instagram_handle' => 'acm_pec',
            
                'long_description' => 'The Association for Computing Machinery (ACM) is an international learned society for computing. It was founded in 1947 and is the world’s largest scientific and educational computing society. The ACM is an umbrella organization for academic and scholarly interests in computer science. PEC ACM CSS is a community of learners and leaders who teach each other to supplement the development of the members’ college education, specifically with regards to Computer Science. The vision of PEC ACM is to provide students exposure to the wide array of topics that fall under the umbrella of the field of computer science.

PEC ACM CSS Subwings -',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/ACM',
            ],
            [
                'name' => 'Robotics Society PEC',
                'code' => 'ROBOTICS',
                'category' => 'technical',
                'description' => 'Dedicated to designing autonomous robots, gesture-controlled quadcopters, combat bots, and embedded hardware for national competitions.',
                'members_count' => 310,
                'icon_name' => 'construct',
                'color' => '#6366F1',
                'instagram_handle' => 'robotics_pec',
            
                'long_description' => 'The Robotics society is one of the esteemed technical societies of Punjab Engineering College, with members having experience in designing, building and implementing solutions through competitions at various platforms nationally and internationally. The main motive of the Robotics society is to create a problem-solving mindset among the students and help them know the minute intricacies of Robotics ranging from basic line-following robots all the way up to gesture-controlled quadcopters. This doesn\'t just enlighten the students with the knowledge of the robots but also rewards them with the experience of participating in national and international competitions. The Robotics society provides the students with a platform where they can enhance their creativity and encourage them to think outside the box. All you need for being a part of the Robotics society is a bit of passion and willingness to learn.

EVENTS:',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/robotics',
            ],
            [
                'name' => 'ASME Student Section (ASME PEC)',
                'code' => 'ASME',
                'category' => 'technical',
                'description' => 'Advancing mechanical innovation, CAD/CAM simulation, 3D printing, and design challenges. Organizers of the flagship CADathon.',
                'members_count' => 290,
                'icon_name' => 'cog',
                'color' => '#D97706',
                'instagram_handle' => 'asme_pec',
            
                'long_description' => 'The American Society of Mechanical Engineers (ASME) is an American professional association that, in its own words, "promotes the art, science, and practice of multidisciplinary engineering and allied sciences around the globe"

ASME PEC Chapter is a not-for-profit membership organization that enables collaboration, knowledge sharing, career enrichment, and skills development across all engineering disciplines, toward a goal of helping the global engineering community develop solutions to benefit lives and livelihoods and it aims to inculcate a sense of technical curiosity amongst the PEC students.

CADathonASME always comes with the events that enhance your skills and are most enjoyable. In this CADathone you had to design a hybrid technology using the given machine to the contestants that performs a useful taskCash prizes worth Rs. 3500 🏆 and certificates for first three rankers!!!',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/asme',
            ],
            [
                'name' => 'SAE PEC (Society of Automotive Engineers)',
                'code' => 'SAE',
                'category' => 'technical',
                'description' => 'Automotive engineering powerhouse. Home to Team PEC Baja (All-Terrain Off-Roaders), Team Punjab Racing (Formula Student), and Effi-Cars.',
                'members_count' => 380,
                'icon_name' => 'car-sport',
                'color' => '#DC2626',
                'instagram_handle' => 'sae_pec',
            
                'long_description' => 'At SAE or the Society of Automotive engineers our motive is to create a place for the gathering of automotive enthusiasts irrespective of their background, which offers them a place to discuss the trends, new technologies, and ideas for the future of the automotive sector. There are members from every branch, be it circuital or non-circuital with only one thing in common, curiosity. So, if you ever wanted to know bumper to bumper about the mechanical horse you see everywhere grab a seat and fasten your seatbelts.

We will teach you everything you need ranging from suspensions, engines, transmissions, gears and so on, so at the end you can contribute in completing the ultimate goal of the society, designing and manufacturing the formula -1 vehicle (FSAE) and the off-roader (BAJA).

The society works on the principle of ‘learn and teach’; hence there will be seniors, around the clock to help you resolve an issue. Our society offers numerous chances, but in order to take use of them, you must be a part of it. The question is, are you diligent enough? Every member of society is hired following a rigorous written test and a personal interview. So, if you believe you have the drive and vision to shape the future, you could be the next.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/sae',
            ],
            [
                'name' => 'ASCE Student Chapter (ASCE PEC)',
                'code' => 'ASCE',
                'category' => 'technical',
                'description' => 'Fostering structural engineering excellence, bridge design, surveying challenges, and sustainable infrastructure workshops.',
                'members_count' => 240,
                'icon_name' => 'business',
                'color' => '#2563EB',
                'instagram_handle' => 'asce_pec',
            
                'long_description' => 'Founded in 1852, the American Society of Civil Engineers (ASCE) represents more than 145,000 members of the civil engineering profession worldwide and is America’s oldest national engineering society. Established in 2014, the American Society of Civil Engineers Student Chapter at Punjab Engineering College (Deemed to be University) is a promising student-run organization that contributes to enriching the lives of its students through social events, industry interaction and engineering competitions.

Comprising of regular general body meets and enjoyable events, ASCE PEC also provides a competitive ground for its members through various competitions. These not only help them put the theory learnt in class to practical use, but also encourages them to explore various aspects of Civil Engineering.

Apart from this, ASCE is known to host guest speakers from different spheres of work who enhance the members\' lives by sharing their experiences, giving professional advice and providing them with opportunities to interact with proficient people across a number of industries.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/asce',
            ],
            [
                'name' => 'ATS (Aerospace Technical Society)',
                'code' => 'ATS',
                'category' => 'technical',
                'description' => 'Skyward innovation in aerodynamics, UAVs, model rocketry, RC aircraft design, and glider aerodynamics.',
                'members_count' => 220,
                'icon_name' => 'airplane',
                'color' => '#0284C7',
                'instagram_handle' => 'ats_pec',
            
                'long_description' => 'Aerospace Technical Society (ATS), the only aeromodelling society of the college, strives to make aerospace interactive and fun at the same time. It is a junction wherein all the technical disciplines come together to work on a common goal be it Computer Science in Mission Planning and Flight Optimisation, Electronics and Communication as part of Avionics and Radar, Mechanical methods for Airframe Design, Civil methods for structural process, Production for aircraft manufacturing and Metallurgy for material selection. The society\'s goal is to give its’ members hands-on experience through aeromodelling activities and expose them to industry-level approaches that will improve their ability to solve problems and foster teamwork.

The Society has a great track record, with its teams going on to participate and win accolades in various reputed events. Within the 2022-23 session, a team from the society built an RC airship and competed in the Model Airship Regatta, and Competition held at IIT Bombay, being the first team from all of north India to do so. The teams also won first and third place in the RC Craft Category at Technoxian\'s World Robotics Championship, which was held in Delhi.

Through blogging and group discussions, the society also aims to keep students up to date on current aerospace events in addition to project-oriented information. Overall, students from all branches are welcome to join ATS!!',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/aerospace-technical-society-ats',
            ],
            [
                'name' => 'IIM Student Chapter (Indian Institute of Metals)',
                'code' => 'IIM',
                'category' => 'technical',
                'description' => 'Dedicated to metallurgy, advanced material characterization, foundry technology, and nanotechnology research.',
                'members_count' => 180,
                'icon_name' => 'layers',
                'color' => '#7C3AED',
                'instagram_handle' => 'iim_pec',
            
                'long_description' => 'IIM (Indian Institute of Metals) is a reputed institution devoted to promotion and advancement in the study, practice and research of metallurgical science and technology. With over 75 years of practicing the science and the art of making and treating of metals and alloys, it is recognized throughout the world as one of the premier metallurgical organizations. Our student chapter at PEC which is also the Chandigarh chapter has been helping further this aim though industry interactions and also conducting events to develop the organizing and soft skills of members with the events being conducted keeping in mind the goals of our parent body. We have had get togethers of the IIM Chandigarh chapter bringing together members from industry and our student members. These gatherings have evolved over time and presently act as knowledge sharing sessions for IIM members.

Being a part of IIM society helps you to gain knowledge, skills and experience in leadership, communication, problem-solving, group development, presentation and public speaking through our various workshops, expert lectures series and other activities.It has been serving the Metallurgical Fraternity through different activities in highlighting emerging challenges and such opportunities since its inception. The chapter is planning to introduce a number of new activities - such as consultancy, training for members to serve the emerging need of the metal industry. Furthermore, we are going to conduct regional level rounds for the preliminary round for the annual quiz which is held on National Metallurgist Day organized by IIM nationally where all chapters are invited. IIM is a great experience to highlight on your CV. When you show up for placement, you will stand out amongst your peers. Professional associations can show hiring managers how committed you are to learn more about the field.Joining IIM society will enable you to connect to a peer group who shares similar interests as you. The connections that you make here can also possibly lead to life-long relationships of both peers and mentors.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/iim',
            ],
            [
                'name' => 'SME (Society of Manufacturing Engineers)',
                'code' => 'SME',
                'category' => 'technical',
                'description' => 'Exploring modern manufacturing, industrial automation, CNC machining, additive manufacturing, and robotics integration.',
                'members_count' => 175,
                'icon_name' => 'hammer',
                'color' => '#EA580C',
                'instagram_handle' => 'sme_pec',
            
                'long_description' => 'SME is a nonprofit association of professionals, educators and students committed to promoting and supporting the manufacturing industry. SME helps manufacturers innovate, grow and prosper by promoting manufacturing technology, developing a skilled workforce and connecting the manufacturing industry. SME supports manufacturing based on our core belief: Manufacturing is key to economic growth and prosperity.

Here at SME- PEC Chapter, we focus on inculcating the core aspects of manufacturing aligning itself with this rapidly changing industry. Our goal is to create a community of like-minded engineers and try to come up with a collective solution to various engineering problems while making fun-to do projects in order to learn via practical application.

Workshops:We try to provide hands on experience in multiple domains which form the core to any Manufacturing process by inviting Industry Leaders, promoters and by developing knowledge in a like-minded peer group. These workshops include- Machine Shop visits, Casting, Forging, Fabrication, Carpentry, Computer Aided Designing (CAD)/ Computer Aided Manufacturing (CAM), Industrial Robotics and other advanced processes/ technologies.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/sme',
            ],
            [
                'name' => 'SESI (Solar Energy Society of India)',
                'code' => 'SESI',
                'category' => 'technical',
                'description' => 'Promoting renewable clean energy, solar vehicle innovations, sustainability projects, and green technology initiatives.',
                'members_count' => 165,
                'icon_name' => 'sunny',
                'color' => '#EAB308',
                'instagram_handle' => 'sesi_pec',
            
                'long_description' => 'The Solar Energy Society of India PEC (SESI PEC) is a technical society that has constantly been trying to connect students from PEC itself and from different colleges across India to participate to promote renewable energy in India. This society is a branch of other higher organizations at the national and international levels in our university.

The Solar Energy of India (SESI) is the Indian Section of the International Solar Energy Society (ISES). ISES was founded in 1954. It’s headquarter is in Breisgau, Germany. First established in 1978 with its secretariat in New Delhi. SESI has an ambitious goal to put across its message of using Renewable energy far and wide.

Its interests cover all aspects of renewable energy, including characteristics, effects, and methods of use, and it provides a common ground to all those concerned with the nature and utilization of this renewable non-polluting resource.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/sesi',
            ],
            [
                'name' => 'IGS (Indian Geotechnical Society)',
                'code' => 'IGS',
                'category' => 'technical',
                'description' => 'Exploring soil mechanics, geotechnical surveying, seismic foundation design, and earth-retaining systems.',
                'members_count' => 150,
                'icon_name' => 'earth',
                'color' => '#84CC16',
                'instagram_handle' => 'igs_pec',
            
                'long_description' => 'The Indian Geotechnical Society (IGS) strives to foster collaboration between scientists and engineers for the promotion and spread of knowledge in the domains of Engineering Geology, Rock Mechanics, Foundation Engineering, Soil Dynamics, and associated fields and their practical applications. Through its several chapters dispersed across India, it offers a common venue for academicians, researchers, designers, construction engineers, equipment producers, and all other individuals engaged in geotechnical activities nationwide. One such Student chapter is our IGS PEC. IGS PEC was established on July 27, 2016. Talented students who are extremely keen about learning geotechnical engineering and event management make up the Indian Geotechnical Society. Our team arranges technical, non-technical, recreational events, workshops, and conferences for students of PEC and other colleges. In addition, we oversee a study group which is our ‘IGS Study Circle’ where students exchange notes, tests, and practise questions all year long.

The theoretical understanding and application of engineering are put to the test through a variety of technical competitions. One of the significant events is MSE, or mechanically stabilized earth. In this event, sand and water should be combined in a ratio such that a cube formed from this mixture has the highest compressive strength possible. Another comparable competition is Damnit. The Nature\'s Geosynthesis competition, which measures students\' understanding of the natural geosynthetic materials utilized in the business, is another significant highlight of the events. In addition to these activities, there are weekly quizzes in the name of CAT and Civil weekly series which allow the students to keep a track of how well they are doing in each subject area. Much recently, we have started an interaction web series \'Vyom\' with our esteemed alumnis.

Students have the opportunity to compete in a variety of events that are scheduled throughout the year and earn various prizes. It will improve their grasp of geotechnical engineering and aid in their test preparation for the CAT and GATE. In order to benefit from their experiences and get career assistance, students may communicate with professionals from various disciplines on this platform.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/igs',
            ],
            [
                'name' => 'Google Developer Student Club (GDSC PEC)',
                'code' => 'GDSC',
                'category' => 'technical',
                'description' => 'Official Google-supported developer community empowering students in Android, Flutter, Cloud, Web, and Generative AI.',
                'members_count' => 460,
                'icon_name' => 'logo-google',
                'color' => '#4285F4',
                'instagram_handle' => 'gdsc_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
            [
                'name' => 'Cyber Security Society (CSS PEC)',
                'code' => 'CSS',
                'category' => 'technical',
                'description' => 'Ethical hacking, CTF competitions, cryptography, network vulnerability assessments, and defensive security.',
                'members_count' => 260,
                'icon_name' => 'shield-checkmark',
                'color' => '#10B981',
                'instagram_handle' => 'css_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],

            // ==========================================
            // 🎭 CULTURAL & LITERARY CLUBS
            // ==========================================
            [
                'name' => 'Music Club PEC (Aarohan)',
                'code' => 'MUSIC',
                'category' => 'cultural',
                'description' => 'Official music society. Showcases vocalists, rock bands, instrumentalists, and classical fusion. Hosts flagship events Chords and Encore.',
                'members_count' => 320,
                'icon_name' => 'musical-notes',
                'color' => '#EC4899',
                'instagram_handle' => 'musicclub_pec',
            
                'long_description' => 'Would you ever have thought that there was a place where Metal-heads, Qawali lovers, Jazz musicians, fans of Rap, Pop, Punjabi Music and Bollywood songs could all vibe together? As astonishing as it may sound, PEC Music Club makes it happen.

The music club is an absolute behemoth of talent, making it one of the most prestigious and popular clubs of the college. As a member of the club, you get a chance not only to hone your skills but also grow holistically as a musician.

OUR EVENTS :',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/music-club',
            ],
            [
                'name' => 'Dramatics Club PEC',
                'code' => 'DRAMATICS',
                'category' => 'cultural',
                'description' => 'The theatrical heartbeat of PEC. Stage plays, Nukkad Natak (Street theatre), mime, and monologues. Organizers of the flagship Aaghaz.',
                'members_count' => 310,
                'icon_name' => 'sparkles',
                'color' => '#8B5CF6',
                'instagram_handle' => 'dramatics_pec',
            
                'long_description' => 'Dramatics is where art and culture thrives. It is one of the most prominent and active clubs of our college. Our club has two wings i.e Dance wing and Acting wing. Our club gives amazing opportunities of performing exciting dance forms and presenting strong theatrical plays. We perform stageplays, streetplays, skits and monologues in addition to numerous dance forms in our inhouse events and in fests across the country. We take a lot of pride in our club and work hard to get accolades for our college.

Major events done by the club:

Aaghaz',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/dramatics-club',
            ],
            [
                'name' => 'Art & Photography Club (APC)',
                'code' => 'APC',
                'category' => 'cultural',
                'description' => 'Creative expression through fine arts, canvas painting, digital illustration, and photography. Organizers of the annual Spectrum exhibition.',
                'members_count' => 280,
                'icon_name' => 'camera',
                'color' => '#F43F5E',
                'instagram_handle' => 'apc_pec',
            
                'long_description' => 'Art and Photography Club, the omnipresent cultural club of the college, also known as APC is a group of people who are enthusiastic about art and photography. The club is a great stage for students to share their creativity, knowledge and passion to explore, learn and create.The club provides great opportunities for its members to enhance their creativity through painting, photography, craft, sketching, doodling, art therapies and much more. Basics of photography like exposure triangle and composition rules are thoroughly explained in photography workshops. The club also conducts various workshops for the students through which the members acquire proficiency and enhance their skills in photography, art, and craft.

The club holds regular GBMs (General Body Meetings) and discussions to exchange ideas and organize events such as photo walks, field trips, competitions and lectures and workshops by visiting artists. Members of the club also explore the possible opportunities for photography and art projects in collaboration with other campus departments, organize peer-to-peer portfolio reviews and explore the possibilities of exhibitions on and off campus.The Art and Photography Club is active all around the year. Not only does it conduct its events, competitions and workshops, but it is also responsible for the decorations of all the events in the college.

Some of the Workshops that APC conducts on an annual basis include:',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/art-and-photography-club-apc',
            ],
            [
                'name' => 'SAASC (Speakers\' Association & Study Circle)',
                'code' => 'SAASC',
                'category' => 'cultural',
                'description' => 'Premier literary, debating, and quizzing council. Comprises DebSoc, MunSoc (Model UN), QuizSoc, and BookSoc. Hosts the flagship fest Verve.',
                'members_count' => 340,
                'icon_name' => 'mic',
                'color' => '#3B82F6',
                'instagram_handle' => 'saasc_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
            [
                'name' => 'Projection Design Club (PDC)',
                'code' => 'PDC',
                'category' => 'cultural',
                'description' => 'Visual arts, UI/UX, motion graphics, video cinematography, stage lighting design, and live concert projections for PECFEST.',
                'members_count' => 230,
                'icon_name' => 'videocam',
                'color' => '#06B6D4',
                'instagram_handle' => 'pdc_pec',
            
                'long_description' => 'Projection and Design Club (PDC), one of the prominent clubs of PEC, is a group for people who are enthusiastic about videography, video editing, digital designing, animation etc. The club provides excellent opportunities for its members to express their creativity and skills through fan art illustrations, video edits, posters, short films, documentaries, etc.

We organize events throughout the year, showcase movies, design posters, marketing brochures, and other digital art for various events like PECFEST, Convocation, Orientation, Open House, Alumni Meet, etc. We also create in-house videos that involve scripting, shooting, directing, and editing and we take care of coverage of all the events and functions in PEC.

The club conducts workshops for the students through which the members acquire proficiency in designing and editing software such as Adobe Photoshop, Adobe After Effects, Adobe Illustrator, Adobe Premiere Pro, and Adobe Audition. We also conduct Camera Handling workshops where various movie directional skills like handling a camera, taking multiple shots, lighting, cinematography, and enhancing video features are taught. Our club has a YouTube Channel where we upload our original short films like FourPlay, Perplexed, Ehsaas, The Diary, etc.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/projection-design-club',
            ],
            [
                'name' => 'Dance Club PEC',
                'code' => 'DANCE',
                'category' => 'cultural',
                'description' => 'Western, Hip-Hop, Contemporary, and Punjabi Bhangra dance crews performing across national inter-college fests.',
                'members_count' => 270,
                'icon_name' => 'flame',
                'color' => '#F97316',
                'instagram_handle' => 'danceclub_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
            [
                'name' => 'English Editorial Board (EEB)',
                'code' => 'EEB',
                'category' => 'cultural',
                'description' => 'Official English literary body of PEC. Publishes campus magazines, creative anthologies, and hosts writing contests.',
                'members_count' => 190,
                'icon_name' => 'book',
                'color' => '#6366F1',
                'instagram_handle' => 'eeb_pec',
            
                'long_description' => 'Introduction

The English Editorial Board (EEB) is a group of individuals who have a passion for writing, and are enthusiastic about the English language and literature.

The Editorial Board is in charge of publishing their annual magazine for PEC, Vista, where the writings of the board members are displayed along with the most-read section of interviews of the highly coveted graduating seniors. In addition, the board also publishes the yearly Souvenir, the college’s official convocation book for graduating seniors. Biannually, there’s also a comic magazine called Ragmag, involving doodles about and around PEC. Our work also involves our internal magazine (Maglagan), Instagram page (@beansta.pec), and Wordpress Blog (Bean Sight) that we update on a regular basis.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/students/cultural-clubs/english-editorial-board',
            ],
            [
                'name' => 'Hindi Editorial Board (HEB)',
                'code' => 'HEB',
                'category' => 'cultural',
                'description' => 'Promoting Hindi literature, poetry recitals (Kavi Sammelan), and editorial publications celebrating linguistic heritage.',
                'members_count' => 160,
                'icon_name' => 'journal',
                'color' => '#D97706',
                'instagram_handle' => 'heb_pec',
            
                'long_description' => 'Introduction

Hindi Editorial Board ( HEB ) is one of the 3 Editorial boards of PEC Chandigarh. The main aim of this club is to make students aware of the rich literary culture that is available in this language and also to encourage them to contribute to this. The Club has successfully conducted various events in the college and has been appreciated by a lot of special guests who are experts in the field of writing. Apart from that, students from HEB have gone to events organized by various colleges (including IITs) and have won there too.

Hindi Editorial Board also helps you in expressing your thoughts through poems and articles in the Hindi language. Every year a few sessions are done for our new recruits wherein they’re taught about the basics of ghazal, nazm, shayri and other forms of poetries. We make sure that your creative side never dies and help you bring the best out of you.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/students/cultural-clubs/hindi-editorial-board',
            ],
            [
                'name' => 'Punjabi Editorial Board (PEB)',
                'code' => 'PEB',
                'category' => 'cultural',
                'description' => 'Celebrating Punjabi culture, folklore, poetry, and publishing regional literary collections.',
                'members_count' => 165,
                'icon_name' => 'library',
                'color' => '#10B981',
                'instagram_handle' => 'peb_pec',
            
                'long_description' => 'Punjab is well known for its energetic and enthusiastic culture. The compassion and high spiritedness exhibited in the lifestyle of the people of Punjab along with its rich heritage is excellently presented by the Punjabi Editorial Board. Being one of the three Editorial Boards of PEC, PEB unceasingly brings forward the true essence of Punjab in the entirety of it. With numerous events and activities, it is one of the most active clubs which never fails to shower its members and its audience, all the same - with an unlimited amount of excitement and thrill.

PEB has six disciplines under it, ensuring each and every member of the PEB fam has an opportunity to grow and take responsibilities in the field they feel driven and enthusiastic for.

The various disciplines of PEB are:',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/students/cultural-clubs/punjabi-editorial-board',
            ],

            // ==========================================
            // 🌐 SOCIAL, SERVICE & LEADERSHIP CELLS
            // ==========================================
            [
                'name' => 'E-Cell (Entrepreneurship & Incubation Cell)',
                'code' => 'ECELL',
                'category' => 'social',
                'description' => 'Fostering the startup ecosystem at PEC. Startup incubation, pitch sessions, angel investor connects, and the annual E-Summit.',
                'members_count' => 380,
                'icon_name' => 'bulb',
                'color' => '#F59E0B',
                'instagram_handle' => 'ecell_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
            [
                'name' => 'Rotaract Club of PEC',
                'code' => 'ROTARACT',
                'category' => 'social',
                'description' => 'Youth wing of Rotary International. Community outreach, blood donation drives, educational upliftment, and social welfare campaigns.',
                'members_count' => 320,
                'icon_name' => 'heart',
                'color' => '#EF4444',
                'instagram_handle' => 'rotaract_pec',
            
                'long_description' => 'With \'Service above Self\' as its motto, Rotaract Club, PEC, Chandigarh, is a prestigious Rotary International youth program under the district code 3080. Supported by the Rotary Club Chandigarh, it aims to promote the virtue of responsible leadership by providing promising youngsters with the opportunity to understand better, embody, and promote the characteristics of responsible citizenship and effective leadership.

Some of the events undertaken to fulfill the objective, as mentioned earlier, are Aadhvitha, Macarena, Inbox, In-reach, Fin-o-knowledge, visits to nursing homes and orphanages etc. The last session saw Rotaract Club initiating yet another act to help reach out to the less privileged by starting a one-stop shop selling t-shirts, clothing accessories etc. Aadhvitha was one such initiative, where the Rotaract club of pec collaborated with Vriddhi to develop the soft skills of the younger generations of the less privileged section of society and sell these items and raise funds for the NGO itself.

Similarly, In association with our parent rotary Rotary Club Chandigarh Central, Rotaract Club PEC organized "MACARENA" - A Dance Marathon & Dj Night, to successfully raise 30k for the cause "EK HAATH AASHA KA," an initiative of Rotaract Club Chandigarh Central and Rotaract Club Pune Downtown to raise money for the donation of mechanical, prosthetic hands to the disadvantaged section of society.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/rotaract-club',
            ],
            [
                'name' => 'NSS (National Service Scheme PEC)',
                'code' => 'NSS',
                'category' => 'social',
                'description' => 'Community engagement, rural adoption initiatives, cleanliness drives, and social health awareness programs.',
                'members_count' => 290,
                'icon_name' => 'people',
                'color' => '#059669',
                'instagram_handle' => 'nss_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
            [
                'name' => 'NCC (National Cadet Corps)',
                'code' => 'NCC',
                'category' => 'social',
                'description' => 'Character building, drill, aero-modelling, rifle training, national camp expeditions, and Republic Day parade contingents.',
                'members_count' => 250,
                'icon_name' => 'shield',
                'color' => '#1E3A8A',
                'instagram_handle' => 'ncc_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
            [
                'name' => 'Women Empowerment Cell (WEC)',
                'code' => 'WEC',
                'category' => 'social',
                'description' => 'Championing gender equality, leadership panels, women in STEM workshops, and campus wellness initiatives.',
                'members_count' => 210,
                'icon_name' => 'ribbon',
                'color' => '#DB2777',
                'instagram_handle' => 'wec_pec',
            
                'long_description' => 'Women Empowerment Cell (WEC) was formed in 2016 under the Saksham Scheme of UGC to empower and orient women to recognize their true potential and to help them attain their stand in a competing world. Our goal is the comprehensive development of women in all spheres of their life. It also helps in creating awareness about important issues related to women and provides a forum for discussion and deliberation on a range of issues through various activities and events such as workshops, pageants, conclaves, surveys, and camps.

We aim is to work together and bridge the gap between the rights of men and women in India and take the progress of our country to new heights. We also stand firmly in our vision to advance Sustainable Development Goals 4 and 5. To read more about the sustainable development goals visit:https://sdgs.un.org/goals

Seminars and Workshops:WEC has partnered with various NGOs and brands working on social impact to organize sensitization workshops on legal rights, empowerment of rural women, and supporting local businesses. We’ve also organized various online events and workshops on menstrual health, gender sensitization, caste, and intersectionality. WEC has also conducted self-defense workshops under the guidance of one of the best instructors for the students of Punjab Engineering College.',
                'faculty_advisor' => '',
                'join_link' => null,
                'website_link' => 'https://pec.ac.in/campus-life/students/cultural-clubs/women-empowerment-cell-wec/women-empowerment-cell-wec',
            ],

            // ==========================================
            // 🏅 SPORTS & ATHLETICS
            // ==========================================
            [
                'name' => 'Sports Club PEC',
                'code' => 'SPORTS',
                'category' => 'sports',
                'description' => 'The official athletic wing overseeing Football, Cricket, Basketball, Badminton, Volleyball, Table Tennis, Lawn Tennis, and Athletics.',
                'members_count' => 410,
                'icon_name' => 'trophy',
                'color' => '#16A34A',
                'instagram_handle' => 'sports_pec',
            
                'long_description' => null,
                'faculty_advisor' => null,
                'join_link' => null,
                'website_link' => null,
            ],
        ];

        foreach ($clubs as $clubData) {
            Club::updateOrCreate(['code' => $clubData['code']], $clubData);
        }
    }
}
