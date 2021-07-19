export default {
  actionBar: {
    what_are_you_working_on: "Woran arbeitest du?",
  },
  chart: {
    labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  },
  activeTimeEntryModal: {
    details: "Details",
    description: "Beschreibung",
    customer: "Kunde",
    billable: "Abrechenbar",
    notBillable: "Nicht abrechenbar",
    startedAt: "Gestartet am",
    stoppedAt: "Beendet am",
    save: "Speichern",
  },
  projectSelect: {
    label: "Projekt",
    placeholder: "Suche nach einem Projekt",
    noProjectsFound: "Keine Projekte gefunden",
  },
  customerSelect: {
    label: "Kunde",
    placeholder: "Suche nach einem Kunden",
    noCustomersFound: "Keine Kunden gefunden",
  },
  timeEntrySelect: {
    noTimeEntriesFound: "Keine Zeiteinträge gefunden",
  },
  header: {
    jumpToCurrentWeek: "Zu aktueller Woche springen",
  },
  projectIndicator: {
    noProject: "Kein Projekt",
  },
  auth: {
    email: "E-Mail Adresse",
    password: "•••••••••••",
    forgotPassword: "Passwort vergessen?",
    signIn: "Anmelden",
    otp: "Einmalkennwort",
    back: "Zurück",
    loginFailed: "Anmedlung fehlgeschlagen",
    welcomeText:
      "Mit dieser App erfasst Du Deine Arbeitszeiten und importierst sie automatisch in das likvi Abrechnungstool.",
    securityText:
      "Deine Daten werden verschlüsselt abgeschickt und sicher gespeichert. Wir gewährleisten DSGVO konformen Datenschutz.",
  },
  timeEntriesEmptyState: {
    heading: "Keine Zeiteinträge",
    text:
      "In dem ausgewählten Zeitraum hast du noch keine Zeiteinträge erfasst.",
  },
  idle: {
    youAreIdleFor: "Du bist inaktiv seit",
    minutes: "Minuten",
    stopAndRemoveInaktive: "Stoppen und inaktive Zeit abziehen",
    keepInaktive: "Inaktive Zeit behalten",
  },
  timeSpan: {
    currentWeek: "Diese Woche",
    weeksAgo: "Vor einer Woche | Vor {n} Wochen",
    weeksAhead: "In einer Woche | In {n} Wochen",
  },
  notification: {
    switchedTeam: "Aktuelles Team wurde gewechselt",
  },
  projectModal: {
    project: "Projekt",
    name: "Name",
    colorHex: "Farbe",
    startDate: "Startdatum",
    endDate: "Enddatum",
    add: "Hinzufügen",
    projectCreated: "Projekt wurde erstellt",
  },
  errors: {
    error: "Fehler",
    close: "Schließen",
    ACTIVE_TIME_ENTRY_EXISTS:
      "Es existiert bereits ein laufender Zeiteintrag. Bitte lade die Seite neu um diesen anzuzeigen.",
    INSUFFICIENT_PERMISSION:
      "Du hast keine ausreichenden Berechtigungen für diese Aktion.",
    INVALID_CREDENTIALS:
      "Diese Zugangsdaten wurden nicht in unserer Datenbank gefunden.",
    INVALID_EMAIL:
      "Es existiert kein Benutzer mit der angegebenen Email-Adresse.",
    INVALID_PASSWORD_CONFIRMATION:
      "Das eigegebene Passwort ist nicht korrekt. Bitte versuche es erneut.",
    INVALID_VERIFICATION_TOKEN: "Ungültiger Verfizierungsschlüssel.",
    MODEL_NOT_FOUND: "Objekt existiert nicht.",
    NO_SUBSCRIPTION: "Bitte schließen zuerst ein Abonnement ab.",
    NO_TOKEN: "Deine Sitzung ist ungültig. Bitte melde dich erneut an.",
    RECENT_PASSWORD_CHANGE:
      "Dein Passwort wurde vor kurzem geändert. Bitte melde dich erneut an.",
    TOKEN_BLACKLISTED:
      "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
    TOKEN_EXPIRED: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
    TOKEN_INVALID: "Deine Sitzung ist ungültig. Bitte melde dich erneut an.",
    TOO_MANY_ATTEMPTS: "Zu viele Anfragen in kurzer Zeit.",
    UNKNOWN_ERROR:
      "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.",
    VALIDATION: "Die eingegebenen Daten sind ungültig/unvollständig.",
    forbidden_error_text:
      "Entschuldigung, du bist nicht berechtigt diesen Inhalt zu sehen.",
    not_found_error_text:
      "Entschuldigung, der Inhalt auf den du versuchst zuzugreifen konnte nicht gefunden werden.",
  },
};
