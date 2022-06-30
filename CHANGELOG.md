# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add time entry autocomplete to edit modal
- Add display of weekly hours to header

## [1.5.0] - 2022-06-01

### Added

- Add color picker with pre-selected colors when creating a project

### Fixed

- Fix that time entries were not scoped to logged in user and other team member time entries were displayed

## [1.4.0] - 2022-04-25

### Added

- Added feature to login in with OAuth

## [1.3.1] - 2021-11-18

- Update CSC

## [1.3.0] - 2021-08-17

### Changed

- Start time entry on enter

### Fixed

- Fix bug where suggest endpoint was used instead of search

### Added

- Add feature to type @ or # and select project and customer directly in task input
- Add feature to autoselect the matching customer when a project is selected

## [1.2.0] - 2021-04-21

### Changed

- Changed billable radio buttons to toggle switch

### Fixed

- Fix bug where description was not cleared after time entries was stopped
- Fix bug where `billable` would be overwritten without a change in UI

## [1.1.0] - 2021-01-07

### Added

- Add feature to create new project from within the app

### Fixed

- Fixed failing tests

## [1.0.2] - 2020-11-28

### Changed

- Upgrade to Tailwind v2

## [1.0.1] - 2020-11-21

### Added

- Windows code signing certificate

### Changed

- Update macOS icon for macOS Big Sur

## [1.0.0] - 2020-11-07

### Added

- Initial public release
