# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.3] 2024-10-08
### Fixed
* Downgrade chalk

## [v1.0.2] 2024-10-04
* Update 'typescript', 'axios', 'chalk', 'tydet-utils' and 'tydet-core' repositories.

## [v1.0.1] 2024-02-20
### Fixed
* Send the error.response from axios API call as the expected error instead of the general axios error.

## [v1.0.0] 2024-02-14
### Added
* Logger Service
* Log to console (styled with chalk)
* Log to a file
* Log to a webhook endpoint