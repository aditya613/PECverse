# Contributing to PECverse

First off, thank you for considering contributing to PECverse! It's people like you that make PECverse a great tool for the student community.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) to see if someone else has already created it. If not, feel free to open a new one using our issue templates!

## 2. Fork & create a branch

If this is something you think you can fix, then fork PECverse and create a branch with a descriptive name.

```bash
git checkout -b fix/your-bug-fix
# or
git checkout -b feature/your-awesome-feature
```

## 3. Local Development Setup

We have two main components: a React Native mobile app and a Laravel backend. 

### Backend (Laravel)
1. `cd pecconnect-backend`
2. `composer install`
3. `cp .env.example .env` (Do NOT add real production keys)
4. `php artisan key:generate`
5. `php artisan migrate --seed`
6. `php artisan serve`

### Mobile (React Native/Expo)
1. `cd pecconnect-mobile`
2. `npm install`
3. `cp .env.example .env`
4. Update `EXPO_PUBLIC_API_URL` to point to your local backend IP.
5. `npx expo start`

## 4. Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first. 

* Ensure any code you write adheres to the existing styling.
* Write clear, readable, and well-documented code.

## 5. Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with PECverse's master branch:

```bash
git remote add upstream https://github.com/your-username/PECverse.git
git fetch upstream
git merge upstream/main
```

Then push your feature branch and open a Pull Request using our template!
