# TableViewCellAnimations

[![CI Status](http://img.shields.io/travis/Adam Suskin/TableViewCellAnimations.svg?style=flat)](https://travis-ci.org/Adam Suskin/TableViewCellAnimations)
[![Version](https://img.shields.io/cocoapods/v/TableViewCellAnimations.svg?style=flat)](http://cocoapods.org/pods/TableViewCellAnimations)
[![License](https://img.shields.io/cocoapods/l/TableViewCellAnimations.svg?style=flat)](http://cocoapods.org/pods/TableViewCellAnimations)
[![Platform](https://img.shields.io/cocoapods/p/TableViewCellAnimations.svg?style=flat)](http://cocoapods.org/pods/TableViewCellAnimations)

## Usage

To run the example project, clone the repo, and run `pod install` from the Example directory first.

After installation, you can import the source file through `#import <TableViewCellAnimations/ASTableViewCell.h>`.

Then, like any other table view, make sure that the kind of table view cell in the table view is `ASTableViewCell`:

![storyboard class setting](http://www.adamsuskin.com/wp-content/uploads/2015/11/Screen-Shot-2015-11-22-at-2.40.02-PM.png)

Wherever you choose to have the table view's `delegate`, make sure your implementation of cellForRowAtIndexPath: uses `ASTableViewCell`:

    -(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {

        ASTableViewCell *cell = (ASTableViewCell *)[tableView dequeueReusableCellWithIdentifier:@"CellIdentifier"];
        
        [cell setDuration:0.25]; //set the duration of the entrance animation
        [cell addAnimation:kASTableViewCellAnimationFadeIn];
    }

Make sure to actually call `animate` in your willDisplayCell:
    -(void)tableView:(UITableView *)tableView willDisplayCell:(nonnull UITableViewCell *)cell forRowAtIndexPath:(nonnull NSIndexPath *)indexPath {
        [(ASTableViewCell *)cell animate];
    }

## Animations

Currently, we support three different kinds of animations:
  -Fade In
  -Slide in from left/right/top/bottom
  -Flip horizontally/vertically

## Requirements

No requirements for this pod. Enjoy!

## Installation

TableViewCellAnimations is available through [CocoaPods](http://cocoapods.org). To install
it, simply add the following line to your Podfile:

```ruby
pod "TableViewCellAnimations"
```

## Author

Adam Suskin, adam@adamsuskin.com

## License

TableViewCellAnimations is available under the MIT license. See the LICENSE file for more info.
