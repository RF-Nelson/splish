//
//  MasterViewController.swift
//  Splish
//
//  Created by Richard Nelson on 4/6/16.
//  Copyright © 2016 Richard Nelson. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import PusherSwift
//
class MasterViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var waitingLabel: UILabel!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var navBar: UINavigationItem!
    
    var json: JSON?
    let apiEndpoint: String = "https://splish.herokuapp.com/api/events"
    
    // To do: convert to a dictionary instead of a nested array
    var eventArray  = [[String]]()
    
    var pusher : Pusher?

    override func viewDidLoad() {
        super.viewDidLoad()
        self.setupTableView()
        fetchEvents()
        listenForNewEvents()
        makeItPurdy()
    }
    
    func fetchEvents( ) -> Void {
        Alamofire.request(.GET, apiEndpoint).validate().responseJSON { response in
            switch response.result {
            case .Success:
                if let value = response.result.value {
                    self.json = JSON(value)
                    
                    for idx in 0...self.json!.count - 1 {
                        var eventData: [String] = []
                        
                        if let title = self.json![idx]["title"].string {
                            eventData.append(title)
                        }
                        
                        if let startDate = self.json![idx]["start_date"].string {
                            eventData.append(startDate)
                        } else {
                            eventData.append("")
                        }
                        
                        if let endDate = self.json![idx]["end_date"].string {
                            eventData.append(endDate)
                        } else {
                            eventData.append("")
                        }
                        
                        if let description = self.json![idx]["description"].string {
                            eventData.append(description)
                        } else {
                            eventData.append("")
                        }
                        
                        self.eventArray.append(eventData)
                    }
                    
                    dispatch_async(dispatch_get_main_queue()) {
                        self.doneLoading()
                    }
                    
                }
            case .Failure(let error):
                print(error)
            }
        }
    }
    
    func doneLoading () -> Void {
        self.tableView.reloadData()
        self.activityIndicator.stopAnimating()
        self.waitingLabel.hidden = true
        self.tableView.hidden = false
    }
    
    func listenForNewEvents() -> Void {
        let pusher = Pusher(key: "28994c89518c14262f75")
        
        let myChannel = pusher.subscribe("test_channel")
        pusher.connect()
        
        myChannel.bind("my_event", callback: { (data: AnyObject?) -> Void in
            let newEvent = JSON(data!)
            var newEventObj = [String]()
            
            newEventObj.append(newEvent["message"]["title"].string!)
            
            if let startDate = newEvent["message"]["start_date"].string {
                newEventObj.append(startDate)
            } else {
                newEventObj.append("")
            }
            
            if let endDate = newEvent["message"]["end_date"].string {
                newEventObj.append(endDate)
            } else {
                newEventObj.append("")
            }
            
            newEventObj.append(newEvent["message"]["description"].string!)
            self.addNewEvent(newEventObj)
            self.tableView.reloadData()
        })
    }
    
    func addNewEvent(event : [String]) -> Void {
        self.eventArray.append(event)
        self.showNewEventAlert(event[0])
    }
    
    func showNewEventAlert(eventTitle: String) -> Void {
        let newEventAlert = UIAlertController(title: "New Event!", message: "New event detected! Would you like to scroll to the new event?", preferredStyle: UIAlertControllerStyle.Alert)
        newEventAlert.addAction(UIAlertAction(title: "Yes", style: .Default, handler: { (action: UIAlertAction!) in
            // User chose to see new event listing (scroll to bottom of tableView)
            self.tableView.scrollToBottom(true)
        }))
        
        newEventAlert.addAction(UIAlertAction(title: "No", style: .Default, handler: { (action: UIAlertAction!) in
            // User chose to do nothing
            return
        }))
        
        self.presentViewController(newEventAlert, animated: true, completion: nil)
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return eventArray.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("EventCell", forIndexPath: indexPath) as! EventCell
        let eventElement = eventArray[indexPath.row]
        let eventTitle = eventElement[0]
        let eventStartDate = eventElement[1]
        let eventEndDate = eventElement[2]
        let eventDescription = eventElement[3]
        
        cell.titleLabel.text = eventTitle
        cell.descriptionLabel.text = eventDescription
        
        let startDateString = eventStartDate
        let endDateString = eventEndDate
        
        let dateFormatter : NSDateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SZ"
        
        if let startDate = dateFormatter.dateFromString(startDateString) {
            let startDateText : String? = NSDateFormatter.localizedStringFromDate(startDate, dateStyle: .ShortStyle, timeStyle: .ShortStyle)
            cell.startDateLabel.text = "Starte Date: " + startDateText!
        } else {
            cell.startDateLabel.text = "Start Date: TBD"
        }
        
        if let endDate = dateFormatter.dateFromString(endDateString) {
            let endDateText : String? = NSDateFormatter.localizedStringFromDate(endDate, dateStyle: .ShortStyle, timeStyle: .ShortStyle)
            cell.endDateLabel.text = "End Date: " + endDateText!
        } else {
            cell.endDateLabel.text = "End Date: TBD"
        }
        
        cell.layer.borderColor = UIColor.lightGrayColor().CGColor
        cell.layer.borderWidth = 1
        
        return cell
    }
    
    func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return false
    }
    
    func setupTableView() -> Void {
        self.tableView.delegate = self
        self.tableView.dataSource = self
        self.tableView.allowsSelection = false
        self.tableView.estimatedRowHeight = 200.0;
        self.tableView.rowHeight = UITableViewAutomaticDimension
    }
    
    func makeItPurdy() -> Void {
        //Gotta add *some* style, right?
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 20, height: 40))
        imageView.contentMode = .ScaleAspectFit
        imageView.image = UIImage(named: "logo.png")
        self.navBar.titleView = imageView
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
}

extension UITableView {
    func scrollToBottom(animated: Bool) {
        var y: CGFloat = 0.0
        if self.contentSize.height > UIScreen.mainScreen().bounds.height {
            y = self.contentSize.height - UIScreen.mainScreen().bounds.height
        }
        self.setContentOffset(CGPointMake(0, y), animated: animated)
    }
}

class EventCell: UITableViewCell {
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var startDateLabel: UILabel!
    @IBOutlet weak var endDateLabel: UILabel!
}

