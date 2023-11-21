---
title: "Flag Deprecation"
---

K3s is a fast-moving project, and as such, we need a way to deprecate flags and configuration options. This page outlines the process for deprecating flags and configuration options. In order to ensure that users are not surprised by the removal of flags, the process is similar to the [Kubernetes Deprecation Policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/).

## Process

1) Flags can be declared as "To Be Deprecated" at any time.
2) Flags that are "To Be Deprecated" must be labeled as such on the next patch of all currently supported releases. Additionally, the flag will begin to warn users that it is going to be deprecated in the next minor release.
3) On the next minor release, a flag will be marked as deprecated in the documentation and converted to a hidden flag in code. The flag will continue to operate and give warnings to users.
4) In the following minor release branch, deprecated flags will become "nonoperational", causing a fatal error if used. This error must explain to the user any new flags or configuration that replace this flag.
5) In the next minor release, the nonoperational flags will be removed from documentation and code.

## Example

An example of the process:

- `--foo` exists in v1.22.14, v1.23.10, and v1.24.2.
- After the v1.24.2 release, it is decided to deprecate `--foo` in favor of `--new-foo`.
- In v1.22.15, v1.23.11, and v1.24.3, `--foo` continues to exist, but will warn users:
    ```
    [Warning] --foo will be deprecated in v1.25.0, use `--new-foo` instead
    ```
    `--foo` will continue to exist as an operational flag for the life of v1.22, v1.23 and v1.24.
- In v1.25.0, `--foo` is marked as deprecated in documentation and will be hidden in code. It will continue to work and warn users to move to `--new-foo`.
- In v1.26.0, `--foo` will cause a fatal error if used. The error message will say:
    ```
    [Fatal] exit 1: --foo is no longer supported, use --new-foo instead
    ```
- In v1.27.0, `--foo` will be removed completely from all code and documentation.
