---
layout: tutorial
title: test
description: test
date: 2000-01-01
---

Okay, the user wants a smooth slide transition between webpages while actually loading a new HTML page each time. They also mentioned that the new page has complex JavaScript, and when navigating back, it should slide out without any JS remaining. Hmm, let me think about how to approach this. First, traditional page transitions are handled with SPAs (Single Page Applications) where content is dynamically loaded without full page reloads. But the user wants to load completely new HTML pages, which means each navigation is a full page load. That's tricky because full page reloads reset everything, including JavaScript state and CSS animations. Wait, maybe there's a way to use CSS animations combined with the browser's history API. Let me recall: if we can intercept the navigation, apply an animation, then proceed with the load. But normally, once you click a link, the browser unloads the current page, so any animations on exit won't be visible. Oh right, the Navigation API and some techniques with CSS might help here. Alternatively, using fetch to load the new page in the background, replace the content, and manage history. But that's more like an SPA approach. However, the user wants each page to be a separate HTML file, not dynamic content loading. Another idea: Use the beforeunload event to trigger an exit animation. But the problem is that the animation might not complete before the page unloads. So maybe using a delay with the animation and having the new page start with an entrance animation. But synchronizing that across two separate pages is challenging because they are separate documents. Wait, perhaps if both pages have the same CSS animation structure. For example, when leaving a page, it slides out, and the incoming page slides in. But how to coordinate the timing between the two pages? Alternatively, use sessionStorage or something to pass a flag. When a link is clicked, set a flag in sessionStorage indicating the direction of the transition. Then, on the next page load, check that flag and apply the corresponding animation. Similarly, when going back, set a different flag.

Let me outline the steps:

1. When a user clicks a link, instead of a normal navigation, intercept it.

2. Add a class to the current page's body to trigger the exit animation (slide out to the left).

3. Wait for the animation to complete, then navigate to the new page.

4. On the new page, when it loads, check if there's a transition direction and apply the entrance animation (slide in from the right).

But the problem is step 3: after the animation, how to trigger the navigation. Normally, you can't delay the navigation because once the link is clicked, the browser starts unloading the page. So any JavaScript that tries to delay navigation (like using setTimeout) might not work because the page context is destroyed.

Hmm, maybe using the History API and fetch to load the new page as text, then replace the current page's content. But that would require all pages to be same-origin and might not handle scripts properly, especially if they rely on being in the head or body.

Alternatively, use a service worker to cache pages and handle transitions. But that's more complex and might be overkill.

Wait, here's another approach inspired by some tutorials I've seen. Use CSS transitions on the entire page. When a link is clicked, add a class to the body that slides the current page out. Then, listen for the transitionend event, and when it fires, change window.location to the new page. The new page starts with the body hidden or off-screen and then slides in. But the challenge is that the new page doesn't know about the previous page's exit animation, so there might be a flash before the entrance animation starts.

To prevent that, the new page needs to start with the entrance animation immediately. But how? Maybe on page load, add a class that triggers the slide-in. But if the previous page's exit animation hasn't finished, the timing could be off.

Alternatively, both pages have a transition container. The current page slides out, then the new page slides in. But since they are separate pages, the transition would have to be seamless. Maybe using some shared CSS and a small delay on the new page's entrance.

Another thing to consider: using opacity and transforms for the animations, which are GPU-accelerated and smoother. Also, ensuring that the animations are applied to a container that wraps the entire page content.

Let me try to outline a possible solution:

1. Both pages have a container div that wraps all content, e.g., <div class="page-container">.

2. The CSS for .page-container includes transitions or animations for sliding in and out.

3. On the initial page, when a link is clicked, prevent default, add an 'exit' class to the container to trigger the slide-out animation, wait for it to finish, then navigate to the new page.

4. On the new page, when it loads, immediately add an 'enter' class to its container to slide in from the right.

But the problem is step 3: how to intercept the link click, play the exit animation, then navigate. This requires JavaScript on each page to handle the link clicks.

So each page's JavaScript would:

- Listen for click events on all links.

- When a link is clicked, check if it's a same-origin link.

- Prevent default navigation.

- Add the exit class to the current page's container.

- Wait for the animation to end using transitionend event.

- Then set window.location.href to the link's href.

On the new page, when it loads, it adds the enter class to its container. The CSS for the enter class would slide the page in from the right.

For the back button, the same logic applies. When the user navigates back, the previous page would need to slide in from the left. Wait, but that's tricky because the back button is handled by the browser's history. How to detect the direction?

Maybe use the History API's state to track the direction. When navigating forward, the exit animation is slide-left, and the enter is slide-right. When navigating back, the exit is slide-right and enter is slide-left. But managing this requires tracking the navigation direction.

Alternatively, use the Navigation API (if supported) or listen for popstate events. But this is getting complicated.

Another approach: When navigating forward (clicking a link), the current page slides out to the left, and the new page slides in from the right. When navigating back, the current page slides out to the right, and the previous page slides in from the left.

To handle the back button, we can use the pageshow event and check if the page is being loaded from the cache (persisted). But this might not be reliable.

Alternatively, on each page, when it's loaded via a forward navigation, it slides in from the right. When it's loaded via a back navigation, it slides in from the left. But how to determine the direction?

Maybe using sessionStorage to store the navigation direction. When a user clicks a link, set a direction as 'forward' in sessionStorage. Then, on page load, check that direction and apply the corresponding animation. If the direction isn't set (like on initial load), no animation. When the user navigates back, the previous page's beforeunload or unload event could set the direction to 'backward'. But the unload event might not have enough time to set sessionStorage.

This is a common problem. Maybe the solution is to use the History API's state to store the navigation direction. When pushing a new state, include a direction. Then, on popstate, check the state's direction.

Wait, here's a possible workflow:

1. All internal links are intercepted via JavaScript.

2. When clicking a link to navigate forward:

a. Prevent default.

b. Add exit animation (slide-left) to current page.

c. After animation, push the new state with direction 'forward' and navigate.

3. On the new page:

a. Check if there's a stored direction (maybe via sessionStorage) or via the history state.

b. Apply enter animation (slide-in from right).

4. When the user clicks the back button:

a. The current page intercepts the popstate event.

b. Add exit animation (slide-right).

c. After animation, navigate back.

But handling the back button is tricky because the popstate event is fired on the current page before it unloads. So maybe:

- When navigating forward, store the direction in sessionStorage as 'forward'.

- When the new page loads, check sessionStorage. If 'forward', slide in from right, then remove the entry.

- When the user clicks back, the previous page (which is now the new page) would need to detect that it's a back navigation. But since it's a separate page, perhaps on its load, it doesn't know. Alternatively, use the pageshow event's persisted property.

Wait, the pageshow event has a persisted property which is true if the page is being loaded from the cache (like when using the back button). So maybe:

On each page:

- Listen for the pageshow event.

- If event.persisted is true, it means the page is being shown from the cache (back navigation), so apply the slide-in from left animation.

- Otherwise, apply the slide-in from right animation.

But this depends on the browser's cache behavior. Not all browsers may reload the page from cache when navigating back, especially if the page has cache headers that prevent it.

Alternatively, combine sessionStorage and the pageshow event. When a user navigates forward, set a 'transition' key in sessionStorage to 'forward'. When the new page loads, check this key. If it's 'forward', apply the forward animation and remove the key. Then, if the user navigates back, the previous page (now loaded from cache) would have no 'transition' key, but how to know to apply the backward animation.

Alternatively, when navigating forward, set the transition direction in sessionStorage, and on the new page, apply the forward animation. When the user navigates back, the previous page (which was cached) would check sessionStorage, but since the back navigation didn't set a direction, maybe use a different approach.

This is getting complicated. Maybe a simpler approach is to have all pages slide in from the right when they load, and when navigating back, rely on the browser's default behavior without an animation. But that's not what the user wants.

Alternatively, use CSS animations that trigger on page load. Each page has an animation that slides in from the right. When a link is clicked, the current page slides out to the left, then the next page slides in. But the problem is that the next page's slide-in happens after it's loaded, which might cause a flash or delay.

Wait, here's a possible CSS setup:

Each page has a body that's initially off-screen to the right. On load, it slides in. When navigating away, it slides out to the left.

But how to manage the initial position. For example:

On the initial page load, the body is not off-screen. But when navigating to a new page, the new page's body starts off-screen and slides in. But how to have the initial page not start off-screen?

Maybe using a class that's added after load. Wait, but the user might see a flash. Alternatively, use a CSS rule that the body starts off-screen, and the initial page uses a script to add a class to slide in immediately. But that would cause a slide-in on the initial page load, which might be desired.