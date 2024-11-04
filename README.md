# A simple roblox-ts framework

Note: This requires https://github.com/AF1nd/Neuwork-Transformer to work properly

## Features:

- Providers:
    Providers are server-side singletons responsible for any important game system. Example:
  
```ts
import { Provider } from "@rbxts/neuwork";
import { DataStoreService } from "@rbxts/services"

@Provider
export class DataProvider {
    set<V>(section: string, key: string, value: V) {
        DataStoreService.GetDataStore(section).UpdateAsync(key, () => $tuple(value));
    }

    get(section: string, key: string) {
        const [success, result] = pcall(() => DataStoreService.GetDataStore(section).GetAsync(key));
        if (!success) error(result);

        return result;
    }
}
```

- Services:
    Services are client-side singletons responsible for any client system. Example:

```ts
import { Service } from "@rbxts/neuwork";

@Service
export class TestService {
    start() {
        print("TestService started!")
    }
}
```
- "Bootloader":
  This is the provider or service that starts first (can be used, for example, for a loading screen)

```ts
import { Service, Bootloader } from "@rbxts/neuwork";

@Service
@Bootloader
export class TestBootloader {
    onBootloaderStarted = new Signal() // For example

    start() {
	print("UwU^^")
	this.onBootloaderStarted.Fire()
    }
}

// TestService waits for bootloader has started and fired signal

import { Service, Inject } from "@rbxts/neuwork";
import { TestBootloader } from "./TestBootloader";

@Service
export class TestService {
    @Inject testBootloader!: TestBootloader;
    start() {
	this.testBootloader.onBootloaderStarted.Wait()
        print("TestService started!");
    }
}
```

- Dependency Injection:
    The neuwork provides the ability to inject dependencies with @Inject decorator. Example:

```ts
// TestService2

import { Service } from "@rbxts/neuwork";

@Service
export class TestService2 {
    print(text: string) { print(text); }
}

// TestService1

import { Service, Inject } from "@rbxts/neuwork";
import { TestService2 } from "./TestService2";

@Service
export class TestService {
    @Inject testService2!: TestService2;
    start() {
        print("TestService started!");
        this.testService2.print("Hello"); // prints Hello
    }
}
```

start() is the method that is called when the singleton starts (logically lol)

# Start neuwork:

```ts
// Server:

import { coreStart } from "@rbxts/neuwork";

const modules = script.Parent!.WaitForChild("providers"); // or name of your folder that contains providers

const promises: Promise<void>[] = [];
modules.GetDescendants().forEach((desc) => {
	promises.push(
		new Promise<void>((resolve) => {
			if (desc.IsA("ModuleScript")) {
				require(desc);
				resolve();
			} else resolve();
		}),
	);
});

Promise.all(promises).then(() => coreStart());

// Client:

import { coreStart } from "@rbxts/neuwork";

const modules = script.Parent!.WaitForChild("services"); // or name of your folder that contains services

const promises: Promise<void>[] = [];
modules.GetDescendants().forEach((desc) => {
	promises.push(
		new Promise<void>((resolve) => {
			if (desc.IsA("ModuleScript")) {
				require(desc);
				resolve();
			} else resolve();
		}),
	);
});

Promise.all(promises).then(() => coreStart());


```
  
