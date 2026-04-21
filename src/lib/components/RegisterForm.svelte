<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { FieldGroup, Field, FieldLabel, FieldDescription } from "$lib/components/ui/field/index.js";
    import { authClient } from "$lib/auth-client";

    let name = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let errorMessage = $state("");
    let successMessage = $state("");
    let isLoading = $state(false);

    const passwordsMatch = $derived(password === confirmPassword);

    const handleSubmit = async () => {
        errorMessage = "";
        successMessage = "";

        if (!passwordsMatch) {
            errorMessage = "Passwords do not match.";
            return;
        }

        isLoading = true;

        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
        });

        isLoading = false;

        if (error) {
            errorMessage = error.message ?? "Registration failed";
            console.error(error);
        } else {
            successMessage = "Account created! You can now sign in.";
            console.log(data);
        }
    };
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <FieldGroup>

        <Field>
            <FieldLabel>Name
                <Input
                        type="text"
                        name="name"
                        placeholder="Jane Doe"
                        bind:value={name}
                        required
                />
            </FieldLabel>
        </Field>

        <Field>
            <FieldLabel>Email
                <Input
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        bind:value={email}
                        required
                />
            </FieldLabel>
        </Field>

        <Field>
            <FieldLabel>Password
                <Input
                        type="password"
                        name="password"
                        bind:value={password}
                        required
                />
            </FieldLabel>
        </Field>

        <Field>
            <FieldLabel>Confirm Password
                <Input
                        type="password"
                        name="confirmPassword"
                        bind:value={confirmPassword}
                        required
                        class={confirmPassword && !passwordsMatch ? "border-red-500" : ""}
                />
            </FieldLabel>
            {#if confirmPassword && !passwordsMatch}
                <FieldDescription class="text-red-500 text-sm mt-1">
                    Passwords do not match.
                </FieldDescription>
            {/if}
        </Field>

        <Field>
            <Button
                    type="submit"
                    class="w-1/2"
                    variant="secondary"
                    disabled={isLoading || !passwordsMatch}
            >
                {isLoading ? "Registering…" : "Register"}
            </Button>

            {#if errorMessage}
                <FieldDescription class="text-center mt-2 text-red-500">
                    {errorMessage}
                </FieldDescription>
            {/if}
            {#if successMessage}
                <FieldDescription class="text-center mt-2 text-green-500">
                    {successMessage}
                </FieldDescription>
            {/if}
        </Field>

    </FieldGroup>
</form>