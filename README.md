# timer
Scriptable javascript timer

This is just a learning experiment to write an application entirely in JavaScript (a langauage that I do not know) using GenAI as much as possible. Most of it was written using Google IDX and Gemini, but I did test some other methods.

Things I have learned (I don't know anything about prompt engineering or GenAI really):

## small prompts for MVP then add features worked better

I tried at first to have an almost complete decent description of the application and to create it in one go. That didn't work very well for me. This could possibly work better if I described the architecture in detail, but describing the interface and outcome did not work for me.

What worked better was to start small and add features one at a time, testing and getting things running in-between adding features. It seems like there's a possible application of test-driven design that could make those cycles more automated, maybe that product already exists.

## There are some relatively simple things that it just won't be able to do

I haven't yet broken down and coded it manually yet, but haveing the plus sign follow the bottom-most row of timers seemed impossible with Gemini. I don't know why Gemini couldn't figure that out, and I haven't yet spent the time to understand the code well enough to fix that myself, though it looks like it won't be that hard. 

## Suggested code changes often have nothing to do with the requested feature.

Sometimes Gemini would add unmatched parentheses or brackets, and it constantly seems to want to adjust whitespace, mostly to add more, which is strange to me. Probably using a model that has tested better on code generation would improve some of this.

## It doesn't write enough comments

As with the real-world, it doesn't write enough comments. Though using GenAI to add comments code it generated seems to work most of the time.
This is especially the case for me working in a new language. I tend to write lots of comments because it's hard for me to keep what everything is doing in my mind when I have to puzzle over every line of code to figure out what it does. 
