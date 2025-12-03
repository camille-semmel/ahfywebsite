export type Language = 'en' | 'fr' | 'de' | 'ru';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Settings Main
    'settings': 'Settings',
    'security_privacy': 'Security and Privacy',
    'language': 'Language',
    'profile_settings': 'Profile Settings',
    'onboarding': 'Onboarding',
    
    // Security
    'account_email': 'Account Email',
    'change_password': 'Change Password',
    'otp_registration': 'OTP Registration',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'confirm_password': 'Confirm Password',
    'update_password': 'Update Password',
    'enable_2fa': 'Enable Two-Factor Authentication',
    'setup_2fa_desc': 'Scan this QR code with your authenticator app',
    'secret_key': 'Secret Key',
    'mark_registered': 'Mark as Registered',
    'password_updated': 'Password updated successfully',
    '2fa_enabled': '2FA has been enabled',
    
    // Language
    'select_language': 'Select your language',
    'language_saved': 'Language preference saved',
    'english': 'English',
    'french': 'French',
    'german': 'German',
    'russian': 'Russian',
    
    // Profile
    'university_name': 'University Name',
    'seats': 'Seats',
    'contract_end': 'Contract End Date',
    
    // Onboarding
    'onboarding_intro': 'Welcome to your mental wellbeing platform',
    'getting_started': 'Getting Started',
    'dashboard_deep_dive': 'Dashboard Deep Dive',
    'students_management': 'Students Management',
    'team_collaboration': 'Team Collaboration',
    'therapist_tools': 'Therapist Tools',
    
    // Getting Started
    'welcome_message': 'Welcome to your comprehensive mental wellbeing platform designed to help universities support student mental health.',
    'platform_workflow': 'The platform workflow follows: Dashboard → Students → Team → Therapist',
    'quick_start_checklist': 'Quick Start Checklist',
    'fill_student_seats': 'Fill student seats',
    'invite_team_members': 'Invite team members',
    'assign_therapists': 'Assign therapists to students',
    'monitor_engagement': 'Monitor student engagement',
    
    // Dashboard Metrics
    'student_seats': 'Student Seats',
    'student_seats_desc': 'Track your license utilization. The circular progress shows seats used vs. total purchased.',
    'student_seats_features': 'Upload student data via CSV using "Fill in seats" button. Request additional seats with the "+" button.',
    
    'active_engagements': 'Active Engagements',
    'active_engagements_desc': 'Monitor real-time student participation across three key areas',
    'therapy_sessions': 'Therapy Sessions: One-on-one therapeutic interactions',
    'self_assessments': 'Self-Assessments: Student-initiated mental health check-ins',
    'resources_accessed': 'Resources Accessed: Educational materials and coping tools viewed',
    'engagement_feature': 'Download detailed engagement analytics with "See report" button',
    
    'emotion_distribution': 'Emotion Distribution',
    'emotion_distribution_desc': 'Understand the emotional landscape of your student body. Track emotions like Joy, Sadness, Surprise, and more.',
    'emotion_use_case': 'Identify trends and proactively support students showing distress signals.',
    'emotion_feature': 'Access detailed emotion analytics and trends with "View insights"',
    
    'therapeutic_engagement': 'Therapeutic Engagement Growth',
    'therapeutic_engagement_desc': 'Track weekly engagement trends and measure platform effectiveness.',
    'therapeutic_visual': 'Bar chart showing 5-week trend with growth percentage and week-over-week comparison.',
    'therapeutic_feature': 'View detailed growth reports with "View insights" button',
    
    // Students Management
    'students_desc': 'View all enrolled students, track individual emotional states and progress, monitor exercise completion, and access personalized student links with advanced filtering and search capabilities.',
    
    // Team Collaboration
    'team_desc': 'Invite admins, therapists, and viewers. Manage role-based permissions, track team member activity, and provide link-based access for external collaborators.',
    
    // Therapist Tools
    'therapist_desc': 'Add and manage therapist profiles, assign therapists to students, and track therapeutic relationships. View students under care and identify critical cases requiring attention.',
    
    // Actions
    'go_to_dashboard': 'Go to Dashboard',
    'go_to_students': 'Go to Students',
    'go_to_team': 'Go to Team',
    'go_to_therapist': 'Go to Therapist',
    
    'name': 'Name',
    'email': 'Email',
    'subject': 'Subject',
    'message': 'Message',
    'submit': 'Submit',
    'support_success': 'Message sent. We\'ll reach out shortly.',
    'required_field': 'This field is required',
    'invalid_email': 'Please enter a valid email',
    'cancel': 'Cancel',
  },
  fr: {
    // Settings Main
    'settings': 'Paramètres',
    'security_privacy': 'Sécurité et Confidentialité',
    'language': 'Langue',
    'profile_settings': 'Paramètres du Profil',
    'onboarding': 'Intégration',
    
    // Security
    'account_email': 'Email du Compte',
    'change_password': 'Changer le Mot de Passe',
    'otp_registration': 'Inscription OTP',
    'current_password': 'Mot de Passe Actuel',
    'new_password': 'Nouveau Mot de Passe',
    'confirm_password': 'Confirmer le Mot de Passe',
    'update_password': 'Mettre à Jour le Mot de Passe',
    'enable_2fa': 'Activer l\'Authentification à Deux Facteurs',
    'setup_2fa_desc': 'Scannez ce code QR avec votre application d\'authentification',
    'secret_key': 'Clé Secrète',
    'mark_registered': 'Marquer comme Inscrit',
    'password_updated': 'Mot de passe mis à jour avec succès',
    '2fa_enabled': 'La 2FA a été activée',
    
    // Language
    'select_language': 'Sélectionnez votre langue',
    'language_saved': 'Préférence de langue enregistrée',
    'english': 'Anglais',
    'french': 'Français',
    'german': 'Allemand',
    'russian': 'Russe',
    
    // Profile
    'university_name': 'Nom de l\'Université',
    'seats': 'Places',
    'contract_end': 'Fin du Contrat',
    
    // Onboarding
    'onboarding_intro': 'Bienvenue sur votre plateforme de bien-être mental',
    'getting_started': 'Commencer',
    'dashboard_deep_dive': 'Tableau de Bord en Détail',
    'students_management': 'Gestion des Étudiants',
    'team_collaboration': 'Collaboration d\'Équipe',
    'therapist_tools': 'Outils du Thérapeute',
    
    // Getting Started
    'welcome_message': 'Bienvenue sur votre plateforme complète de bien-être mental conçue pour aider les universités à soutenir la santé mentale des étudiants.',
    'platform_workflow': 'Le flux de travail de la plateforme suit: Tableau de bord → Étudiants → Équipe → Thérapeute',
    'quick_start_checklist': 'Liste de Démarrage Rapide',
    'fill_student_seats': 'Remplir les places étudiantes',
    'invite_team_members': 'Inviter des membres d\'équipe',
    'assign_therapists': 'Assigner des thérapeutes aux étudiants',
    'monitor_engagement': 'Surveiller l\'engagement des étudiants',
    
    // Dashboard Metrics
    'student_seats': 'Places Étudiantes',
    'student_seats_desc': 'Suivez l\'utilisation de vos licences. Le progrès circulaire montre les places utilisées par rapport au total acheté.',
    'student_seats_features': 'Téléchargez les données des étudiants via CSV en utilisant le bouton "Remplir les places". Demandez des places supplémentaires avec le bouton "+".',
    
    'active_engagements': 'Engagements Actifs',
    'active_engagements_desc': 'Surveillez la participation des étudiants en temps réel dans trois domaines clés',
    'therapy_sessions': 'Séances de Thérapie: Interactions thérapeutiques individuelles',
    'self_assessments': 'Auto-évaluations: Bilans de santé mentale initiés par les étudiants',
    'resources_accessed': 'Ressources Consultées: Matériels éducatifs et outils d\'adaptation consultés',
    'engagement_feature': 'Téléchargez des analyses d\'engagement détaillées avec le bouton "Voir le rapport"',
    
    'emotion_distribution': 'Distribution des Émotions',
    'emotion_distribution_desc': 'Comprenez le paysage émotionnel de votre corps étudiant. Suivez les émotions comme la Joie, la Tristesse, la Surprise, et plus encore.',
    'emotion_use_case': 'Identifiez les tendances et soutenez de manière proactive les étudiants montrant des signes de détresse.',
    'emotion_feature': 'Accédez aux analyses détaillées des émotions et aux tendances avec "Voir les insights"',
    
    'therapeutic_engagement': 'Croissance de l\'Engagement Thérapeutique',
    'therapeutic_engagement_desc': 'Suivez les tendances d\'engagement hebdomadaires et mesurez l\'efficacité de la plateforme.',
    'therapeutic_visual': 'Graphique à barres montrant la tendance sur 5 semaines avec pourcentage de croissance et comparaison hebdomadaire.',
    'therapeutic_feature': 'Consultez les rapports de croissance détaillés avec le bouton "Voir les insights"',
    
    // Students Management
    'students_desc': 'Consultez tous les étudiants inscrits, suivez les états émotionnels individuels et les progrès, surveillez la complétion des exercices, et accédez aux liens personnalisés des étudiants avec des capacités avancées de filtrage et de recherche.',
    
    // Team Collaboration
    'team_desc': 'Invitez des administrateurs, thérapeutes et observateurs. Gérez les permissions basées sur les rôles, suivez l\'activité des membres de l\'équipe et fournissez un accès basé sur des liens pour les collaborateurs externes.',
    
    // Therapist Tools
    'therapist_desc': 'Ajoutez et gérez les profils de thérapeutes, assignez des thérapeutes aux étudiants et suivez les relations thérapeutiques. Consultez les étudiants sous soins et identifiez les cas critiques nécessitant une attention.',
    
    // Actions
    'go_to_dashboard': 'Aller au Tableau de Bord',
    'go_to_students': 'Aller aux Étudiants',
    'go_to_team': 'Aller à l\'Équipe',
    'go_to_therapist': 'Aller au Thérapeute',
    
    'name': 'Nom',
    'email': 'Email',
    'subject': 'Sujet',
    'message': 'Message',
    'submit': 'Soumettre',
    'support_success': 'Message envoyé. Nous vous contacterons bientôt.',
    'required_field': 'Ce champ est requis',
    'invalid_email': 'Veuillez entrer un email valide',
    'cancel': 'Annuler',
  },
  de: {
    // Settings Main
    'settings': 'Einstellungen',
    'security_privacy': 'Sicherheit und Datenschutz',
    'language': 'Sprache',
    'profile_settings': 'Profileinstellungen',
    'onboarding': 'Onboarding',
    
    // Security
    'account_email': 'Konto-E-Mail',
    'change_password': 'Passwort Ändern',
    'otp_registration': 'OTP-Registrierung',
    'current_password': 'Aktuelles Passwort',
    'new_password': 'Neues Passwort',
    'confirm_password': 'Passwort Bestätigen',
    'update_password': 'Passwort Aktualisieren',
    'enable_2fa': 'Zwei-Faktor-Authentifizierung Aktivieren',
    'setup_2fa_desc': 'Scannen Sie diesen QR-Code mit Ihrer Authenticator-App',
    'secret_key': 'Geheimer Schlüssel',
    'mark_registered': 'Als Registriert Markieren',
    'password_updated': 'Passwort erfolgreich aktualisiert',
    '2fa_enabled': '2FA wurde aktiviert',
    
    // Language
    'select_language': 'Wählen Sie Ihre Sprache',
    'language_saved': 'Spracheinstellung gespeichert',
    'english': 'Englisch',
    'french': 'Französisch',
    'german': 'Deutsch',
    'russian': 'Russisch',
    
    // Profile
    'university_name': 'Universitätsname',
    'seats': 'Plätze',
    'contract_end': 'Vertragsende',
    
    // Onboarding
    'onboarding_intro': 'Willkommen auf Ihrer Plattform für mentales Wohlbefinden',
    'getting_started': 'Erste Schritte',
    'dashboard_deep_dive': 'Dashboard im Detail',
    'students_management': 'Schülerverwaltung',
    'team_collaboration': 'Teamzusammenarbeit',
    'therapist_tools': 'Therapeuten-Tools',
    
    // Getting Started
    'welcome_message': 'Willkommen auf Ihrer umfassenden Plattform für mentales Wohlbefinden, die Universitäten dabei unterstützt, die psychische Gesundheit der Studierenden zu fördern.',
    'platform_workflow': 'Der Plattform-Workflow folgt: Dashboard → Schüler → Team → Therapeut',
    'quick_start_checklist': 'Schnellstart-Checkliste',
    'fill_student_seats': 'Schülerplätze füllen',
    'invite_team_members': 'Teammitglieder einladen',
    'assign_therapists': 'Therapeuten zu Schülern zuweisen',
    'monitor_engagement': 'Schülerengagement überwachen',
    
    // Dashboard Metrics
    'student_seats': 'Schülerplätze',
    'student_seats_desc': 'Verfolgen Sie Ihre Lizenznutzung. Der kreisförmige Fortschritt zeigt verwendete vs. gekaufte Plätze.',
    'student_seats_features': 'Laden Sie Schülerdaten per CSV mit dem Button "Plätze füllen" hoch. Fordern Sie zusätzliche Plätze mit dem "+" Button an.',
    
    'active_engagements': 'Aktive Engagements',
    'active_engagements_desc': 'Überwachen Sie die Teilnahme der Schüler in Echtzeit in drei Schlüsselbereichen',
    'therapy_sessions': 'Therapiesitzungen: Einzeltherapeutische Interaktionen',
    'self_assessments': 'Selbsteinschätzungen: Von Schülern initiierte psychische Gesundheitschecks',
    'resources_accessed': 'Zugriff auf Ressourcen: Angesehene Bildungsmaterialien und Bewältigungstools',
    'engagement_feature': 'Laden Sie detaillierte Engagement-Analysen mit dem Button "Bericht ansehen" herunter',
    
    'emotion_distribution': 'Emotionsverteilung',
    'emotion_distribution_desc': 'Verstehen Sie die emotionale Landschaft Ihrer Schülerschaft. Verfolgen Sie Emotionen wie Freude, Traurigkeit, Überraschung und mehr.',
    'emotion_use_case': 'Identifizieren Sie Trends und unterstützen Sie proaktiv Schüler, die Anzeichen von Stress zeigen.',
    'emotion_feature': 'Greifen Sie auf detaillierte Emotionsanalysen und Trends mit "Einblicke anzeigen" zu',
    
    'therapeutic_engagement': 'Wachstum des Therapeutischen Engagements',
    'therapeutic_engagement_desc': 'Verfolgen Sie wöchentliche Engagement-Trends und messen Sie die Wirksamkeit der Plattform.',
    'therapeutic_visual': 'Balkendiagramm zeigt 5-Wochen-Trend mit Wachstumsprozentsatz und Woche-zu-Woche-Vergleich.',
    'therapeutic_feature': 'Zeigen Sie detaillierte Wachstumsberichte mit dem Button "Einblicke anzeigen" an',
    
    // Students Management
    'students_desc': 'Sehen Sie alle eingeschriebenen Schüler, verfolgen Sie individuelle emotionale Zustände und Fortschritte, überwachen Sie die Übungsvervollständigung und greifen Sie auf personalisierte Schülerlinks mit erweiterten Filter- und Suchfunktionen zu.',
    
    // Team Collaboration
    'team_desc': 'Laden Sie Administratoren, Therapeuten und Zuschauer ein. Verwalten Sie rollenbasierte Berechtigungen, verfolgen Sie Teammitgliederaktivitäten und bieten Sie linkbasierten Zugang für externe Mitarbeiter.',
    
    // Therapist Tools
    'therapist_desc': 'Fügen Sie Therapeutenprofile hinzu und verwalten Sie sie, weisen Sie Therapeuten zu Schülern zu und verfolgen Sie therapeutische Beziehungen. Sehen Sie Schüler unter Betreuung und identifizieren Sie kritische Fälle, die Aufmerksamkeit erfordern.',
    
    // Actions
    'go_to_dashboard': 'Zum Dashboard',
    'go_to_students': 'Zu den Schülern',
    'go_to_team': 'Zum Team',
    'go_to_therapist': 'Zum Therapeuten',
    
    'name': 'Name',
    'email': 'E-Mail',
    'subject': 'Betreff',
    'message': 'Nachricht',
    'submit': 'Absenden',
    'support_success': 'Nachricht gesendet. Wir werden uns in Kürze bei Ihnen melden.',
    'required_field': 'Dieses Feld ist erforderlich',
    'invalid_email': 'Bitte geben Sie eine gültige E-Mail ein',
    'cancel': 'Abbrechen',
  },
  ru: {
    // Settings Main
    'settings': 'Настройки',
    'security_privacy': 'Безопасность и Конфиденциальность',
    'language': 'Язык',
    'profile_settings': 'Настройки Профиля',
    'onboarding': 'Ознакомление',
    
    // Security
    'account_email': 'Email Аккаунта',
    'change_password': 'Изменить Пароль',
    'otp_registration': 'Регистрация OTP',
    'current_password': 'Текущий Пароль',
    'new_password': 'Новый Пароль',
    'confirm_password': 'Подтвердить Пароль',
    'update_password': 'Обновить Пароль',
    'enable_2fa': 'Включить Двухфакторную Аутентификацию',
    'setup_2fa_desc': 'Отсканируйте этот QR-код с помощью приложения для аутентификации',
    'secret_key': 'Секретный Ключ',
    'mark_registered': 'Отметить как Зарегистрированный',
    'password_updated': 'Пароль успешно обновлен',
    '2fa_enabled': '2FA была включена',
    
    // Language
    'select_language': 'Выберите ваш язык',
    'language_saved': 'Языковые настройки сохранены',
    'english': 'Английский',
    'french': 'Французский',
    'german': 'Немецкий',
    'russian': 'Русский',
    
    // Profile
    'university_name': 'Название Университета',
    'seats': 'Места',
    'contract_end': 'Дата Окончания Контракта',
    
    // Onboarding
    'onboarding_intro': 'Добро пожаловать на вашу платформу психического благополучия',
    'getting_started': 'Начало Работы',
    'dashboard_deep_dive': 'Подробная Панель Управления',
    'students_management': 'Управление Студентами',
    'team_collaboration': 'Командное Сотрудничество',
    'therapist_tools': 'Инструменты Терапевта',
    
    // Getting Started
    'welcome_message': 'Добро пожаловать на вашу комплексную платформу психического благополучия, разработанную для помощи университетам в поддержке психического здоровья студентов.',
    'platform_workflow': 'Рабочий процесс платформы: Панель управления → Студенты → Команда → Терапевт',
    'quick_start_checklist': 'Контрольный Список Быстрого Старта',
    'fill_student_seats': 'Заполнить места студентов',
    'invite_team_members': 'Пригласить членов команды',
    'assign_therapists': 'Назначить терапевтов студентам',
    'monitor_engagement': 'Отслеживать вовлеченность студентов',
    
    // Dashboard Metrics
    'student_seats': 'Места Студентов',
    'student_seats_desc': 'Отслеживайте использование ваших лицензий. Круговой прогресс показывает использованные места по отношению к общему количеству купленных.',
    'student_seats_features': 'Загрузите данные студентов через CSV, используя кнопку "Заполнить места". Запросите дополнительные места с помощью кнопки "+".',
    
    'active_engagements': 'Активные Взаимодействия',
    'active_engagements_desc': 'Отслеживайте участие студентов в реальном времени в трех ключевых областях',
    'therapy_sessions': 'Терапевтические Сессии: Индивидуальные терапевтические взаимодействия',
    'self_assessments': 'Самооценки: Самостоятельные проверки психического здоровья студентов',
    'resources_accessed': 'Доступ к Ресурсам: Просмотренные образовательные материалы и инструменты преодоления',
    'engagement_feature': 'Загрузите подробную аналитику вовлеченности с помощью кнопки "Посмотреть отчет"',
    
    'emotion_distribution': 'Распределение Эмоций',
    'emotion_distribution_desc': 'Поймите эмоциональный ландшафт вашего студенческого контингента. Отслеживайте эмоции, такие как Радость, Грусть, Удивление и другие.',
    'emotion_use_case': 'Выявляйте тенденции и проактивно поддерживайте студентов, проявляющих признаки стресса.',
    'emotion_feature': 'Получите доступ к подробной аналитике эмоций и тенденциям с помощью "Посмотреть инсайты"',
    
    'therapeutic_engagement': 'Рост Терапевтического Взаимодействия',
    'therapeutic_engagement_desc': 'Отслеживайте еженедельные тенденции вовлеченности и измеряйте эффективность платформы.',
    'therapeutic_visual': 'Столбчатая диаграмма показывает 5-недельную тенденцию с процентом роста и сравнением неделя к неделе.',
    'therapeutic_feature': 'Просмотрите подробные отчеты о росте с помощью кнопки "Посмотреть инсайты"',
    
    // Students Management
    'students_desc': 'Просматривайте всех зарегистрированных студентов, отслеживайте индивидуальные эмоциональные состояния и прогресс, контролируйте выполнение упражнений и получайте доступ к персонализированным ссылкам студентов с расширенными возможностями фильтрации и поиска.',
    
    // Team Collaboration
    'team_desc': 'Приглашайте администраторов, терапевтов и наблюдателей. Управляйте разрешениями на основе ролей, отслеживайте активность членов команды и предоставляйте доступ на основе ссылок для внешних сотрудников.',
    
    // Therapist Tools
    'therapist_desc': 'Добавляйте и управляйте профилями терапевтов, назначайте терапевтов студентам и отслеживайте терапевтические отношения. Просматривайте студентов под опекой и выявляйте критические случаи, требующие внимания.',
    
    // Actions
    'go_to_dashboard': 'Перейти к Панели Управления',
    'go_to_students': 'Перейти к Студентам',
    'go_to_team': 'Перейти к Команде',
    'go_to_therapist': 'Перейти к Терапевту',
    
    'name': 'Имя',
    'email': 'Email',
    'subject': 'Тема',
    'message': 'Сообщение',
    'submit': 'Отправить',
    'support_success': 'Сообщение отправлено. Мы свяжемся с вами в ближайшее время.',
    'required_field': 'Это поле обязательно',
    'invalid_email': 'Пожалуйста, введите действительный email',
    'cancel': 'Отмена',
  },
};
