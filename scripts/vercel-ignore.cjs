/**
 * Vercel Ignored Build Step Script
 *
 * Exit code semantics for Vercel:
 * - exit 0 : SKIP the build (Vercel ignores this commit, saves build minutes, no deployment)
 * - exit 1 : PROCEED with the build (Vercel installs dependencies & builds)
 */

const { execSync } = require('child_process');

function shouldSkipBuild() {
  const commitMsg = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
  const branch = process.env.VERCEL_GIT_COMMIT_REF || '';
  const vercelEnv = process.env.VERCEL_ENV || 'preview';

  console.log(`[Vercel Ignore] Evaluating deployment for branch: "${branch}", env: "${vercelEnv}"`);
  console.log(`[Vercel Ignore] Commit message: "${commitMsg}"`);

  // 1. Skip if commit message contains standard skip flags
  const skipPatterns = [
    /\[skip ci\]/i,
    /\[ci skip\]/i,
    /\[skip vercel\]/i,
    /\[vercel skip\]/i,
    /\[no ci\]/i
  ];
  if (skipPatterns.some((pattern) => pattern.test(commitMsg))) {
    console.log('[Vercel Ignore] Build skipped: Commit message contains skip flag.');
    return true;
  }

  // 2. Skip if branch is explicitly an experimental, draft, or WIP branch
  if (/^(wip|draft|temp|test)\//i.test(branch)) {
    console.log(`[Vercel Ignore] Build skipped: Branch "${branch}" is marked as WIP or draft.`);
    return true;
  }

  // 3. Inspect git diff to check if only non-code files were touched
  try {
    let diffRange = 'HEAD~1 HEAD';
    if (process.env.VERCEL_GIT_PREVIOUS_SHA && process.env.VERCEL_GIT_PREVIOUS_SHA !== process.env.VERCEL_GIT_COMMIT_SHA) {
      diffRange = `${process.env.VERCEL_GIT_PREVIOUS_SHA} HEAD`;
    }

    const output = execSync(`git diff --name-only ${diffRange}`, { encoding: 'utf8' });
    const changedFiles = output
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    console.log(`[Vercel Ignore] Changed files (${changedFiles.length}):`, changedFiles);

    if (changedFiles.length > 0) {
      // Ignored patterns: documentation, ide configs, and git metadata
      const ignoredFilePatterns = [
        /^README\.md$/i,
        /\.md$/i,
        /^docs\//i,
        /^\.github\//i,
        /^\.vscode\//i,
        /^\.idea\//i,
        /^\.agents\//i,
        /^\.gemini\//i,
        /^LICENSE/i,
        /^\.gitignore$/i,
        /^\.npmrc$/i,
        /^\.editorconfig$/i
      ];

      const hasAppCodeChanges = changedFiles.some((file) => {
        return !ignoredFilePatterns.some((pattern) => pattern.test(file));
      });

      if (!hasAppCodeChanges) {
        console.log('[Vercel Ignore] Build skipped: Changes only affect documentation or non-app metadata.');
        return true;
      }
    }
  } catch (err) {
    console.warn('[Vercel Ignore] Git diff check failed, falling back to commit message prefix:', err.message);
    const isPureDocCommit = /^(docs|doc|chore|style|test)(\(.*\))?:\s*/i.test(commitMsg.trim());
    if (isPureDocCommit) {
      console.log('[Vercel Ignore] Build skipped based on commit message prefix.');
      return true;
    }
  }

  console.log('[Vercel Ignore] App code changes detected. Proceeding with build.');
  return false;
}

if (shouldSkipBuild()) {
  // Exit 0 cancels/skips Vercel build
  process.exit(0);
} else {
  // Exit 1 tells Vercel to build
  process.exit(1);
}
