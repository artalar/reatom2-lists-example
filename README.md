# reatom2-lists-example

Created with CodeSandbox

To see the point of this example create a few users and roles, link it, open react debugger and choose "highlight update" option, try to change some linked name \ role and see thats only dependent components rerende. The important not here is there no normalization and no O(n) walking under child element. Each element update is O(1).
